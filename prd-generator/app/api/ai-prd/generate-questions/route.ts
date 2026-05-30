import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { buildGenerateQuestionsPrompt } from "@/lib/ai/prompts";

export const maxDuration = 60;

// POST /api/ai-prd/generate-questions
export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const { idea, platform, aiTool } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "Ide produk wajib diisi" }, { status: 400 });
    }

    const prompt = buildGenerateQuestionsPrompt({
      idea,
      platform: platform || "Web App",
      aiTool: aiTool || "General",
    });

    // Call AI directly via fetch (same as OpenAICompatibleProvider)
    const apiKey = process.env.AI_API_KEY!;
    const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert product manager. Return ONLY valid JSON arrays. No markdown, no explanation.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        stream: false,
      }),
      signal: AbortSignal.timeout(55000),
    });

    let rawText = "";
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("text/event-stream")) {
      const text = await res.text();
      for (const line of text.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") break;
        try {
          const chunk = JSON.parse(data);
          rawText += chunk.choices?.[0]?.delta?.content || "";
        } catch { /* skip */ }
      }
    } else {
      const data = await res.json();
      rawText = data.choices?.[0]?.message?.content || "";
    }

    // Parse JSON array from response
    let questions: string[] = [];
    try {
      const match = rawText.match(/\[[\s\S]*?\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      }
    } catch {
      questions = rawText
        .split("\n")
        .map((l) => l.replace(/^[\d\.\-\*\s"]+/, "").replace(/[",]+$/, "").trim())
        .filter((l) => l.length > 10 && l.includes("?"))
        .slice(0, 5);
    }

    // Fallback
    if (questions.length === 0) {
      questions = [
        "Siapa target pengguna utama produk ini?",
        "Fitur inti apa yang harus ada di versi pertama?",
        "Apakah perlu sistem autentikasi pengguna?",
        "Bagaimana data pengguna disimpan — cloud atau lokal?",
      ];
    }

    return NextResponse.json({ questions: questions.slice(0, 5) });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Silakan login terlebih dahulu" }, { status: 401 });
    }
    console.error("Generate questions error:", error);
    return NextResponse.json({ error: "Gagal generate pertanyaan" }, { status: 500 });
  }
}
