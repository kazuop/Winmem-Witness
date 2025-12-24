import { describe, it, expect } from "vitest";
import { buildMerkle } from "../../src/utils/merkle.js";
describe("merkle", () => {
  it("builds root and proofs", () => {
    const leaves = ["a".repeat(64), "b".repeat(64), "c".repeat(64)];
    const { root, proofs } = buildMerkle(leaves);
    expect(root.length).toBeGreaterThan(10);
    expect(Object.keys(proofs).length).toBe(3);
  });
});
