import { StorageAdapter } from "../adapters/storage.adapter.js";
import { decodeCursor, encodeCursor } from "../utils/pagination.js";
export class ArchiveService {
  constructor(private storage: StorageAdapter) {}
  async list(projectId: string, limit: number, cursor?: string) {
    const c = cursor ? decodeCursor(cursor) : null;
    const items = await this.storage.prisma.archive.findMany({
      where: { projectId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(c ? { cursor: { id: c.id }, skip: 1 } : {})
    });
    const hasNext = items.length > limit;
    const slice = items.slice(0, limit);
    const nextCursor = hasNext ? encodeCursor({ id: slice[slice.length-1].id, createdAt: slice[slice.length-1].createdAt.toISOString() }) : null;
    return { items: slice, nextCursor };
  }
}
