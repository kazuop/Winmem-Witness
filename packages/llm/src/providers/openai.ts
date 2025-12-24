/**
 * OpenAI provider stub.
 * The SDK is intentionally not included to keep dependencies minimal in the core repo.
 * Implementations can be provided in deployment forks.
 */
import type { LlmProvider, LlmResult } from "../types.js";

export class OpenAIProvider implements LlmProvider {
  name = "openai";
  constructor(private _opts: { apiKey: string; baseUrl?: string }) {}
  async complete(_req: { model: string; messages: any[]; temperature?: number; maxTokens?: number }): Promise<LlmResult> {
    throw new Error("OpenAIProvider is a stub. Provide an implementation in your deployment.");
  }
}
