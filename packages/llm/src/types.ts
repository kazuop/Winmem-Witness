export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };
export type LlmResult = { text: string; usage?: { inputTokens?: number; outputTokens?: number } };

export interface LlmProvider {
  name: string;
  complete(req: { model: string; messages: LlmMessage[]; temperature?: number; maxTokens?: number }): Promise<LlmResult>;
}
