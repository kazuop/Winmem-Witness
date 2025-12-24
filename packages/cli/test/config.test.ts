import { describe, it, expect } from "vitest";
import { WinmemConfigSchema } from "../src/lib/config.js";

describe("WinmemConfigSchema", () => {
  it("parses minimal config", () => {
    const cfg = WinmemConfigSchema.parse({ version: "1", api: { url: "http://localhost:8787" }, projects: [] });
    expect(cfg.api.url).toContain("http");
  });
});
