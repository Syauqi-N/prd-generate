import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { getAIProvider } from "@/lib/ai";
import { buildGenerateAIPRDPrompt } from "@/lib/ai/prompts";
import { logUsage } from "@/lib/usage";

export const maxDuration = 120;

// POST /api/ai-prd/generate
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { idea, platform, aiTool, answers, productName } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "Ide produk wajib diisi" }, { status: 400 });
    }

    // Check credit
    if (user.credits < 1) {
      return NextResponse.json(
        { error: "Credit kamu habis. Silakan beli credit untuk melanjutkan." },
        { status: 402 }
      );
    }

    const answersText = Object.entries(answers || {})
      .map(([q, a]) => `Q: ${q}\nA: ${a || "(tidak dijawab)"}`)
      .join("\n\n");

    const prompt = buildGenerateAIPRDPrompt({
      productName: productName || idea,
      idea,
      platform: platform || "Web App",
      aiTool: aiTool || "General",
      answers: answersText || "(tidak ada jawaban tambahan)",
    });

    // Generate via AI
    const ai = getAIProvider();
    const result = await ai.improveSection({
      sectionTitle: "PRD for AI Tools",
      sectionContent: prompt,
      improvementType: "generate-ai-prd",
    });

    const title = `[AI PRD] ${productName || idea}`.slice(0, 100);

    // Deduct credit and save document atomically
    const [updatedUser, document] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.pRDDocument.create({
        data: {
          userId: user.id,
          title,
          productName: productName || idea,
          productType: platform || "Web App",
          outputStyle: "AI Tools",
          status: "GENERATED",
          content: result,
          metadata: { aiTool, type: "ai-prd" },
        },
      }),
    ]);

    // Save inputs
    await prisma.pRDInput.create({
      data: {
        documentId: document.id,
        idea,
        productType: platform,
        outputStyle: "AI Tools",
        targetUsage: aiTool,
        answers: answers || {},
      },
    });

    await logUsage({
      userId: user.id,
      documentId: document.id,
      action: "GENERATE_PRD",
      creditUsed: 1,
      aiProvider: process.env.AI_PROVIDER,
      aiModel: process.env.AI_MODEL,
      metadata: { type: "ai-prd", aiTool, platform },
    });

    return NextResponse.json({
      document,
      creditsRemaining: updatedUser.credits,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    console.error("AI PRD generate error:", error);
    return NextResponse.json(
      { error: "Gagal generate PRD. Credit kamu tidak dikurangi." },
      { status: 500 }
    );
  }
}
