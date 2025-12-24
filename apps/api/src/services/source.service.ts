import { StorageAdapter } from "../adapters/storage.adapter.js";
import { ApiError } from "../utils/errors.js";
export class SourceService {
  constructor(private storage: StorageAdapter) {}
  list(projectId: string) { return this.storage.prisma.source.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } }); }
  async add(projectId: string, input: { kind: "ADDRESS"|"PROGRAM"|"ACCOUNT_SNAPSHOT"; value: string }) {
    try { return await this.storage.prisma.source.create({ data: { projectId, kind: input.kind as any, value: input.value } }); }
    catch { throw new ApiError(409, "CONFLICT", "Source already exists"); }
  }
  async remove(projectId: string, sourceId: string) {
    const s = await this.storage.prisma.source.findFirst({ where: { id: sourceId, projectId } });
    if (!s) throw new ApiError(404, "NOT_FOUND", "Source not found");
    await this.storage.prisma.source.delete({ where: { id: sourceId } });
    return { ok: true };
  }
}
