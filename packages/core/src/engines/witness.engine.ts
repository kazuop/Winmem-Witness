import { sha256Hex } from "@winmem/cryptography";

export type WitnessWindow = { start: number; end: number };
export type WitnessLog = {
  window: WitnessWindow;
  eventCounts: Record<string, number>;
  notableSignatures: string[];
  notes: string;
};

export function buildWitness(projectId: string, window: WitnessWindow, events: Array<{ type: string; signature: string }>): { log: WitnessLog; leafHash: string } {
  const counts: Record<string, number> = {};
  for (const e of events) counts[e.type] = (counts[e.type] ?? 0) + 1;

  const log: WitnessLog = {
    window,
    eventCounts: counts,
    notableSignatures: events.slice(0, 10).map(e => e.signature),
    notes: "Deterministic witness log generated from normalized events."
  };

  const leafHash = sha256Hex({ projectId, kind: "WITNESS_LOG", windowStart: window.start, windowEnd: window.end, content: log });
  return { log, leafHash };
}
