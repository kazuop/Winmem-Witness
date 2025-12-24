import { StorageAdapter } from "../adapters/storage.adapter.js";
import { ApiError } from "../utils/errors.js";
import { decodeCursor, encodeCursor } from "../utils/pagination.js";

export class ProjectService {
  constructor(private storage: StorageAdapter) {}
  async list(tenantId: string, limit: number, cursor?: string) {
    const c = cursor ? decodeCursor(cursor) : null;
    const items = await this.storage.prisma.project.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(c ? { cursor: { id: c.id }, skip: 1 } : {})
    });
    const hasNext = items.length > limit;
    const slice = items.slice(0, limit);
    const nextCursor = hasNext ? encodeCursor({ id: slice[slice.length-1].id, createdAt: slice[slice.length-1].createdAt.toISOString() }) : null;
    return { items: slice, nextCursor };
  }
  async get(tenantId: string, projectId: string) {
    const p = await this.storage.prisma.project.findFirst({ where: { tenantId, id: projectId } });
    if (!p) throw new ApiError(404, "NOT_FOUND", "Project not found");
    return p;
  }
  async create(tenantId: string, input: { name: string; description?: string; cluster: string }) {
    return await this.storage.prisma.project.create({ data: { tenantId, ...input } });
  }
  async updateStatus(tenantId: string, projectId: string, status: "ACTIVE"|"LEGACY"|"ARCHIVED") {
    await this.get(tenantId, projectId);
    return await this.storage.prisma.project.update({ where: { id: projectId }, data: { status } });
  }
}
