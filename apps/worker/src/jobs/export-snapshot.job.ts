import { Storage } from "../adapters/storage.js";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
export async function exportSnapshotJob(storage: Storage, payload: { projectId: string; exportId: string }) {
  const project = await storage.prisma.project.findUnique({ where: { id: payload.projectId } });
  if (!project) return { ok: false, reason: "project_missing" };
  const sources = await storage.prisma.source.findMany({ where: { projectId: project.id } });
  const batches = await storage.prisma.auditBatch.findMany({ where: { projectId: project.id }, orderBy: { windowEnd: "desc" }, take: 50 });
  const memories = await storage.prisma.memory.findMany({ where: { projectId: project.id }, orderBy: { createdAt: "desc" }, take: 200 });
  const snapshot = { exportedAt: new Date().toISOString(), project, sources, memories, auditBatches: batches };
  const buf = Buffer.from(JSON.stringify(snapshot, null, 2), "utf8");
  const checksum = crypto.createHash("sha256").update(buf).digest("hex");
  const outDir = process.env.WINMEM_EXPORT_DIR ?? "./exports";
  await fs.mkdir(outDir, { recursive: true });
  const file = path.join(outDir, `winmem_export_${payload.exportId}.json`);
  await fs.writeFile(file, buf);
  await storage.prisma.export.update({ where: { id: payload.exportId }, data: { status: "READY", url: `file://${path.resolve(file)}`, checksum, meta: { size: buf.length } } });
  return { ok: true, file, checksum };
}
