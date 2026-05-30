import type {
  AIProvider,
  GeneratePRDInput,
  GeneratePRDOutput,
  RegenerateSectionInput,
  ImproveSectionInput,
} from "./ai-provider";
import {
  buildGeneratePRDPrompt,
  buildImproveSectionPrompt,
  buildRegenerateSectionPrompt,
} from "./prompts";

export class OpenAICompatibleProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.AI_API_KEY || "";
    this.baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
    this.model = process.env.AI_MODEL || "gpt-4o-mini";
  }

  private async chat(systemPrompt: string, userMessage: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2 min timeout

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`AI API error: ${res.status} ${err}`);
      }

      // Handle both streaming and non-streaming responses
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/event-stream")) {
        const text = await res.text();
        let content = "";
        for (const line of text.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const chunk = JSON.parse(data);
            content += chunk.choices?.[0]?.delta?.content || "";
          } catch {
            // skip malformed chunks
          }
        }
        return { choices: [{ message: { content } }], usage: null };
      }

      return res.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  async generatePRD(input: GeneratePRDInput): Promise<GeneratePRDOutput> {
    const answersText = Object.entries(input.answers)
      .map(([q, a]) => `Q: ${q}\nA: ${a || "(tidak dijawab)"}`)
      .join("\n\n");

    const prompt = buildGeneratePRDPrompt({
      productName: input.productName,
      idea: input.idea,
      productType: input.productType,
      outputStyle: input.outputStyle,
      targetUsage: input.targetUsage,
      templateName: input.templateName,
      answers: answersText,
    });

    const data = await this.chat(
      "You are an expert product manager who writes clear, structured PRDs.",
      prompt
    );

    const content = data.choices?.[0]?.message?.content || "";
    return {
      content,
      tokenInput: data.usage?.prompt_tokens,
      tokenOutput: data.usage?.completion_tokens,
      provider: process.env.AI_PROVIDER || "openai",
      model: this.model,
    };
  }

  async regenerateSection(input: RegenerateSectionInput): Promise<string> {
    const prompt = buildRegenerateSectionPrompt({
      documentContext: input.documentContext,
      sectionTitle: input.sectionTitle,
      sectionContent: input.sectionContent,
      instruction: input.instruction,
    });

    const data = await this.chat(
      "You are an expert product manager. Rewrite only the requested section.",
      prompt
    );

    return data.choices?.[0]?.message?.content || "";
  }

  async improveSection(input: ImproveSectionInput): Promise<string> {
    const prompt = buildImproveSectionPrompt({
      sectionTitle: input.sectionTitle,
      sectionContent: input.sectionContent,
      improvementType: input.improvementType,
    });

    const data = await this.chat(
      "You are an expert product manager and technical writer.",
      prompt
    );

    return data.choices?.[0]?.message?.content || "";
  }
}
