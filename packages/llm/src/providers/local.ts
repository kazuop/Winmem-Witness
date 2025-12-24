import type { LlmProvider, LlmResult } from "../types.js";

export class LocalDeterministicProvider implements LlmProvider {
  name = "local-deterministic";
  async complete(req: { model: string; messages: any[] }): Promise<LlmResult> {
    const last = req.messages?.slice(-1)?.[0]?.content ?? "";
    return { text: `LLM disabled. Deterministic placeholder response. Input: ${last.slice(0, 240)}` };
  }
}
