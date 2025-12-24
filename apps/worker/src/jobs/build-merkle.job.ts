import { Storage } from "../adapters/storage.js";
import { buildMerkle } from "../utils/merkle.js";
export async function buildMerkleJob(storage: Storage, payload: { projectId: string; maxItems: number }) {
  const items = await storage.prisma.memory.findMany({ where: { projectId: payload.projectId, leafHash: { not: null }, batchId: null }, orderBy: { createdAt: "asc" }, take: payload.maxItems });
  if (!items.length) return { ok: true, skipped: true };
  const leaves = items.map(i => i.leafHash!) as string[];
  const { root, proofs } = buildMerkle(leaves);
  const windowStart = Math.min(...items.map(i=>i.windowStart));
  const windowEnd = Math.max(...items.map(i=>i.windowEnd));
  const batch = await storage.prisma.auditBatch.create({ data: { projectId: payload.projectId, windowStart, windowEnd, root, count: items.length, manifest: { kind: "memory", windowStart, windowEnd, leafCount: items.length } } });
  for (let i=0;i<items.length;i++){
    const mem = items[i];
    await storage.prisma.auditItem.create({ data: { batchId: batch.id, kind: "memory", refId: mem.id, leaf: mem.leafHash!, path: proofs[i] } });
    await storage.prisma.memory.update({ where: { id: mem.id }, data: { batchId: batch.id } });
  }
  return { ok: true, batchId: batch.id, root, count: items.length };
}
