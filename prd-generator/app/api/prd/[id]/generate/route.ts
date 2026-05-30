import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { getAIProvider } from "@/lib/ai";
import { logUsage } from "@/lib/usage";

export const maxDuration = 120; // 2 minutes

// POST /api/prd/[id]/generate
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const { idea, productType, outputStyle, targetUsage, templateName, answers } = body;

    // Check credit
    if (user.credits < 1) {
      return NextResponse.json(
        { error: "Credit kamu habis. Silakan upgrade untuk melanjutkan generate PRD." },
        { status: 402 }
      );
    }

    const document = await prisma.pRDDocument.findFirst({
      where: { id, userId: user.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
    }

    // Save input
    await prisma.pRDInput.upsert({
      where: { documentId: id },
      update: { idea, productType, outputStyle, targetUsage, answers },
      create: { documentId: id, idea, productType, outputStyle, targetUsage, answers },
    });

    // Generate PRD
    const ai = getAIProvider();
    const result = await ai.generatePRD({
      productName: document.productName || document.title,
      idea,
      productType: productType || document.productType || "Web App",
      outputStyle: outputStyle || document.outputStyle || "Simple",
      targetUsage: targetUsage || "Personal Idea",
      templateName: templateName || "Startup MVP PRD",
      answers: answers || {},
    });

    // Deduct credit and update document atomically
    const [updatedUser, updatedDoc] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.pRDDocument.update({
        where: { id },
        data: {
          content: result.content,
          status: "GENERATED",
          productType: productType || document.productType,
          outputStyle: outputStyle || document.outputStyle,
        },
      }),
    ]);

    // Log usage
    await logUsage({
      userId: user.id,
      documentId: id,
      action: "GENERATE_PRD",
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
    console.error("Generate PRD error:", error);
    return NextResponse.json(
      { error: "Gagal generate PRD. Silakan coba lagi. Credit kamu tidak dikurangi." },
      { status: 500 }
    );
  }
}
