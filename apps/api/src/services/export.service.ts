import { StorageAdapter } from "../adapters/storage.adapter.js";
import { BlobAdapter } from "../adapters/blob.adapter.js";
import { ApiError } from "../utils/errors.js";
export class ExportService {
  constructor(private storage: StorageAdapter, private blob: BlobAdapter) {}
  async list(projectId: string) {
    const items = await this.storage.prisma.export.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } });
    return { items, nextCursor: null };
  }
  create(projectId: string) { return this.storage.prisma.export.create({ data: { projectId, status: "PENDING" } }); }
  async markReady(exportId: string, payload: object) {
    const buf = Buffer.from(JSON.stringify(payload, null, 2), "utf8");
    const key = `exports/${exportId}.json`;
    const { url, checksum } = await this.blob.putObject(key, buf);
    return await this.storage.prisma.export.update({ where: { id: exportId }, data: { status: "READY", url, checksum, meta: { size: buf.length } } });
  }
  async get(exportId: string) {
    const e = await this.storage.prisma.export.findUnique({ where: { id: exportId } });
    if (!e) throw new ApiError(404, "NOT_FOUND", "Export not found");
    return e;
  }
}
