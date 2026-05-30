import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { getAIProvider } from "@/lib/ai";
import { logUsage } from "@/lib/usage";

// POST /api/prd/[id]/regenerate-section
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const { sectionTitle, sectionContent, instruction } = await req.json();

    const document = await prisma.pRDDocument.findFirst({
      where: { id, userId: user.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
    }

    const ai = getAIProvider();
    const improved = await ai.regenerateSection({
      documentContext: document.content.slice(0, 500),
      sectionTitle,
      sectionContent,
      instruction: instruction || "Perbaiki dan tingkatkan bagian ini",
    });

    await logUsage({
      userId: user.id,
      documentId: id,
      action: "REGENERATE_SECTION",
      creditUsed: 0,
      metadata: { sectionTitle },
    });

    return NextResponse.json({ content: improved });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    return NextResponse.json({ error: "Gagal regenerate section" }, { status: 500 });
  }
}
