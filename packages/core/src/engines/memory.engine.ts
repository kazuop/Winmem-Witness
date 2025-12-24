/**
 * Memory engine compacts witness logs into durable "minimum existence" memory.
 * The default implementation is deterministic and does not require LLMs.
 */
import { sha256Hex } from "@winmem/cryptography";

export type MemoryRecord = {
  projectId: string;
  windowStart: number;
  windowEnd: number;
  kind: "WITNESS_LOG" | "SNAPSHOT" | "NOTE";
  content: any;
};

export function leafHashForMemory(m: MemoryRecord): string {
  return sha256Hex({ projectId: m.projectId, kind: m.kind, windowStart: m.windowStart, windowEnd: m.windowEnd, content: m.content });
}
