import { Storage } from "../adapters/storage.js";
import { SolanaClient } from "../adapters/solana.js";
export async function fetchTransactionsJob(storage: Storage, solana: SolanaClient, payload: { projectId: string; limit: number }) {
  const rawRefs = await storage.prisma.rawRef.findMany({ where: { projectId: payload.projectId }, orderBy: { createdAt: "desc" }, take: payload.limit });
  for (const r of rawRefs) {
    const existing = await storage.prisma.event.findFirst({ where: { projectId: payload.projectId, signature: r.signature } });
    if (existing) continue;
    const tx = await solana.getTransaction(r.signature);
    if (!tx) continue;
    const data = {
      signature: r.signature,
      slot: Number(r.slot),
      blockTime: r.blockTime,
      meta: { err: tx.meta?.err ?? null, fee: tx.meta?.fee ?? null },
      message: {
        accountKeys: tx.transaction.message.getAccountKeys().staticAccountKeys.map(k => k.toBase58()).slice(0,64),
        instructions: tx.transaction.message.compiledInstructions.map(ix => ({ programIdIndex: ix.programIdIndex, accountKeyIndexes: Array.from(ix.accountKeyIndexes), data: Buffer.from(ix.data).toString("base64") }))
      }
    };
    try {
      await storage.prisma.event.create({ data: { projectId: payload.projectId, signature: r.signature, slot: r.slot, blockTime: r.blockTime ?? undefined, type: "tx", data } });
    } catch {}
  }
  return { ok: true, scanned: rawRefs.length };
}
