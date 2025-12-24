import type { LlmProvider, LlmResult } from "../types.js";

export class AnthropicProvider implements LlmProvider {
  name = "anthropic";
  constructor(private _opts: { apiKey: string }) {}
  async complete(_req: { model: string; messages: any[]; temperature?: number; maxTokens?: number }): Promise<LlmResult> {
    throw new Error("AnthropicProvider is a stub. Provide an implementation in your deployment.");
  }
}
