export class LlmAdapter {
  enabled(): boolean { return false; }
  async summarize() { return { title: "Witness Summary", body: "LLM disabled. Deterministic summary." }; }
}
