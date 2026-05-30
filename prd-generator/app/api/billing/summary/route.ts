import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";

// GET /api/billing/summary
export async function GET() {
  try {
    const user = await requireAuth();

    const [invoices, plans] = await Promise.all([
      prisma.invoice.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { plan: true },
      }),
      prisma.plan.findMany({ where: { isActive: true }, orderBy: { price: "asc" } }),
    ]);

    return NextResponse.json({
      credits: user.credits,
      invoices,
      plans,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
