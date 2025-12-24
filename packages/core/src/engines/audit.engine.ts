import { buildMerkle } from "@winmem/cryptography";

export type AuditBatch = { root: string; proofs: Record<number, any> };

export function auditLeaves(leaves: string[]): AuditBatch {
  return buildMerkle(leaves);
}
