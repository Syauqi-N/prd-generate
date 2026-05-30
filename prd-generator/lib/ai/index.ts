import type { AIProvider } from "./ai-provider";
import { MockAIProvider } from "./mock-provider";
import { OpenAICompatibleProvider } from "./openai-provider";

let _provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  const providerName = process.env.AI_PROVIDER || "mock";

  switch (providerName.toLowerCase()) {
    case "openai":
    case "openai-compatible":
    case "groq":
    case "together":
    case "anthropic":
      _provider = new OpenAICompatibleProvider();
      break;
    case "mock":
    default:
      _provider = new MockAIProvider();
      break;
  }

  return _provider;
}
