import { Storage } from "../adapters/storage.js";
import { sha256Hex } from "../utils/hash.js";
export async function summarizeWitnessJob(storage: Storage, payload: { projectId: string; cadenceSeconds: number }) {
  const now = Math.floor(Date.now()/1000);
  const windowEnd = now;
  const windowStart = now - payload.cadenceSeconds;
  const events = await storage.prisma.event.findMany({ where: { projectId: payload.projectId, blockTime: { gte: windowStart, lte: windowEnd } as any } });
  const counts: Record<string, number> = {};
  for (const e of events) counts[e.type] = (counts[e.type] ?? 0) + 1;
  const content = { window: { start: windowStart, end: windowEnd }, eventCounts: counts, notableSignatures: events.slice(0,10).map(e=>e.signature), notes: "Deterministic witness log generated from normalized events." };
  const leafHash = sha256Hex({ projectId: payload.projectId, kind: "WITNESS_LOG", windowStart, windowEnd, content });
  const mem = await storage.prisma.memory.create({ data: { projectId: payload.projectId, windowStart, windowEnd, kind: "WITNESS_LOG", content, leafHash } });
  return { ok: true, memoryId: mem.id, leafHash };
}
