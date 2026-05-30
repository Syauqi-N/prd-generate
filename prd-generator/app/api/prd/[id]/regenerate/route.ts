import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { getAIProvider } from "@/lib/ai";
import { logUsage } from "@/lib/usage";

export const maxDuration = 120;

// POST /api/prd/[id]/regenerate
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (user.credits < 1) {
      return NextResponse.json(
        { error: "Credit kamu habis. Silakan upgrade untuk melanjutkan." },
        { status: 402 }
      );
    }

    const document = await prisma.pRDDocument.findFirst({
      where: { id, userId: user.id },
      include: { inputs: true },
    });

    if (!document) {
      return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
    }

    if (!document.inputs) {
      return NextResponse.json({ error: "Input dokumen tidak ditemukan" }, { status: 400 });
    }

    const ai = getAIProvider();
    const result = await ai.generatePRD({
      productName: document.productName || document.title,
      idea: document.inputs.idea,
      productType: document.inputs.productType || document.productType || "Web App",
      outputStyle: document.inputs.outputStyle || document.outputStyle || "Simple",
      targetUsage: document.inputs.targetUsage || "Personal Idea",
      templateName: "Startup MVP PRD",
      answers: (document.inputs.answers as Record<string, string>) || {},
    });

    const [updatedUser, updatedDoc] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.pRDDocument.update({
        where: { id },
        data: { content: result.content, status: "GENERATED" },
      }),
    ]);

    await logUsage({
      userId: user.id,
      documentId: id,
      action: "REGENERATE_PRD",
      creditUsed: 1,
      aiProvider: result.provider,
      aiModel: result.model,
      tokenInput: result.tokenInput,
      tokenOutput: result.tokenOutput,
    });

    return NextResponse.json({
      document: updatedDoc,
      creditsRemaining: updatedUser.credits,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    console.error("Regenerate PRD error:", error);
    return NextResponse.json(
      { error: "Gagal regenerate PRD. Silakan coba lagi. Credit kamu tidak dikurangi." },
      { status: 500 }
    );
  }
}
