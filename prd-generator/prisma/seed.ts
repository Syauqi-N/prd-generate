import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Seed Plans
  const plans = [
    {
      name: "Free",
      description: "Mulai gratis dengan 1 credit",
      price: 0,
      creditAmount: 1,
      features: ["1 credit", "Generate 1 PRD", "Export Markdown"],
      isActive: true,
    },
    {
      name: "Starter",
      description: "Cocok untuk mahasiswa dan freelancer",
      price: 29000,
      creditAmount: 10,
      features: [
        "10 credits",
        "Generate 10 PRD",
        "Export Markdown & PDF",
        "AI Assistant",
      ],
      isActive: true,
    },
    {
      name: "Pro",
      description: "Untuk founder dan product manager",
      price: 79000,
      creditAmount: 30,
      features: [
        "30 credits",
        "Generate 30 PRD",
        "Export Markdown & PDF",
        "AI Assistant",
        "Premium Templates",
      ],
      isActive: true,
    },
    {
      name: "Business",
      description: "Untuk tim dan penggunaan intensif",
      price: 199000,
      creditAmount: 100,
      features: [
        "100 credits",
        "Generate 100 PRD",
        "Export Markdown & PDF",
        "AI Assistant",
        "Premium Templates",
        "Priority Support",
      ],
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.name.toLowerCase() },
      update: plan,
      create: { id: plan.name.toLowerCase(), ...plan },
    });
  }
  console.log("✓ Plans seeded");

  // Seed Templates
  const templates = [
    {
      name: "Startup MVP PRD",
      slug: "startup-mvp",
      description: "Template untuk startup yang ingin membangun MVP cepat",
      isPremium: false,
      structure: {
        sections: [
          "Product Overview",
          "Problem Statement",
          "Goals & Objectives",
          "Target Users",
          "Core Features",
          "MVP Scope",
          "Out of Scope",
          "Success Metrics",
        ],
      },
    },
    {
      name: "Technical PRD",
      slug: "technical",
      description: "Template teknis untuk tim engineering",
      isPremium: true,
      structure: {
        sections: [
          "Product Overview",
          "Background",
          "Problem Statement",
          "Goals & Objectives",
          "Target Users",
          "User Personas",
          "Core Features",
          "User Flow",
          "Functional Requirements",
          "Non-Functional Requirements",
          "MVP Scope",
          "Out of Scope",
          "Acceptance Criteria",
          "Risks & Assumptions",
          "Success Metrics",
          "Future Enhancements",
        ],
      },
    },
    {
      name: "Academic Project PRD",
      slug: "academic",
      description: "Template untuk tugas akhir dan proyek kampus",
      isPremium: false,
      structure: {
        sections: [
          "Product Overview",
          "Background",
          "Problem Statement",
          "Goals & Objectives",
          "Target Users",
          "Core Features",
          "Functional Requirements",
          "Non-Functional Requirements",
          "MVP Scope",
          "Acceptance Criteria",
        ],
      },
    },
    {
      name: "SaaS PRD",
      slug: "saas",
      description: "Template khusus untuk produk SaaS",
      isPremium: true,
      structure: {
        sections: [
          "Product Overview",
          "Background",
          "Problem Statement",
          "Goals & Objectives",
          "Target Users",
          "User Personas",
          "Core Features",
          "User Flow",
          "Functional Requirements",
          "Non-Functional Requirements",
          "MVP Scope",
          "Out of Scope",
          "Acceptance Criteria",
          "Risks & Assumptions",
          "Success Metrics",
          "Future Enhancements",
        ],
      },
    },
    {
      name: "Marketplace PRD",
      slug: "marketplace",
      description: "Template untuk platform marketplace",
      isPremium: true,
      structure: {
        sections: [
          "Product Overview",
          "Problem Statement",
          "Goals & Objectives",
          "Target Users",
          "User Personas",
          "Core Features",
          "User Flow",
          "Functional Requirements",
          "MVP Scope",
          "Success Metrics",
        ],
      },
    },
    {
      name: "Mobile App PRD",
      slug: "mobile-app",
      description: "Template untuk aplikasi mobile iOS/Android",
      isPremium: false,
      structure: {
        sections: [
          "Product Overview",
          "Problem Statement",
          "Goals & Objectives",
          "Target Users",
          "Core Features",
          "User Flow",
          "Functional Requirements",
          "Non-Functional Requirements",
          "MVP Scope",
          "Out of Scope",
          "Success Metrics",
        ],
      },
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
  }
  console.log("✓ Templates seeded");

  // Seed Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@prdgenerator.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      credits: 999,
    },
  });
  console.log(`✓ Admin user seeded: ${adminEmail}`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
