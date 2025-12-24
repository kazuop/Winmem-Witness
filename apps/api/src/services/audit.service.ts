import { StorageAdapter } from "../adapters/storage.adapter.js";
import { ApiError } from "../utils/errors.js";
export class AuditService {
  constructor(private storage: StorageAdapter) {}
  async listBatches(projectId: string, limit: number) {
    const items = await this.storage.prisma.auditBatch.findMany({ where: { projectId }, orderBy: { windowEnd: "desc" }, take: limit });
    return { items, nextCursor: null };
  }
  async getProofByLeaf(leaf: string) {
    const item = await this.storage.prisma.auditItem.findFirst({ where: { leaf } });
    if (!item) throw new ApiError(404, "NOT_FOUND", "Proof not found");
    const batch = await this.storage.prisma.auditBatch.findUnique({ where: { id: item.batchId } });
    if (!batch) throw new ApiError(500, "INTERNAL_ERROR", "Batch missing for proof");
    return { leaf: item.leaf, path: item.path, root: batch.root, batch };
  }
}
