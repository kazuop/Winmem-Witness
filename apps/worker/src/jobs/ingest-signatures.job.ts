import { Storage } from "../adapters/storage.js";
import { SolanaClient } from "../adapters/solana.js";
export async function ingestSignaturesJob(storage: Storage, solana: SolanaClient, payload: { projectId: string; limit: number }) {
  const sources = await storage.prisma.source.findMany({ where: { projectId: payload.projectId } });
  for (const s of sources) {
    if (s.kind !== "ADDRESS") continue;
    const sigs = await solana.getSignaturesForAddress(s.value, payload.limit);
    for (const it of sigs) {
      try {
        await storage.prisma.rawRef.create({ data: { projectId: payload.projectId, signature: it.signature, slot: it.slot, blockTime: it.blockTime ?? undefined, err: it.err ?? undefined, rpcUrl: solana.conn.rpcEndpoint } });
      } catch {}
    }
  }
  return { ok: true, sources: sources.length };
}
