import { Storage } from "../adapters/storage.js";
const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
const SPL_TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export async function normalizeEventsJob(storage: Storage, payload: { projectId: string; limit: number }) {
  const events = await storage.prisma.event.findMany({ where: { projectId: payload.projectId, type: "tx" }, orderBy: { createdAt: "desc" }, take: payload.limit });
  for (const e of events) {
    const keys: string[] = (e.data as any)?.message?.accountKeys ?? [];
    let newType = "tx";
    if (keys.includes(MEMO_PROGRAM)) newType = "memo";
    if (keys.includes(SPL_TOKEN_PROGRAM)) newType = "spl";
    if (newType !== e.type) await storage.prisma.event.update({ where: { id: e.id }, data: { type: newType } });
  }
  return { ok: true, normalized: events.length };
}
