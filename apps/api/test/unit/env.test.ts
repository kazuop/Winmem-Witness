import { describe, it, expect } from "vitest";
import { loadEnv } from "../../src/config/env.js";
describe("loadEnv", () => {
  it("parses minimal env", () => {
    const env = loadEnv({
      PORT: "8787",
      WINMEM_API_KEY_ADMIN: "aaaaaaaa",
      WINMEM_API_KEY_READONLY: "bbbbbbbb",
      DATABASE_URL: "postgresql://x",
      REDIS_URL: "redis://x"
    } as any);
    expect(env.PORT).toBe(8787);
  });
});
