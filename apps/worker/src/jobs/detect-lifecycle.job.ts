import { Storage } from "../adapters/storage.js";
export async function detectLifecycleJob(storage: Storage, payload: { projectId: string; legacyDays: number; archiveDays: number }) {
  const project = await storage.prisma.project.findUnique({ where: { id: payload.projectId } });
  if (!project) return { ok: false, reason: "project_missing" };
  const now = Math.floor(Date.now()/1000);
  const legacyThreshold = now - payload.legacyDays*86400;
  const archiveThreshold = now - payload.archiveDays*86400;
  const last = await storage.prisma.event.findFirst({ where: { projectId: payload.projectId }, orderBy: { createdAt: "desc" } });
  if (!last) { if (project.status !== "LEGACY") await storage.prisma.project.update({ where: { id: project.id }, data: { status: "LEGACY" } }); return { ok: true, status: "LEGACY" }; }
  const lastBT = last.blockTime ?? now;
  if (lastBT < archiveThreshold && project.status !== "ARCHIVED") { await storage.prisma.project.update({ where: { id: project.id }, data: { status: "ARCHIVED" } }); return { ok: true, status: "ARCHIVED" }; }
  if (lastBT < legacyThreshold && project.status === "ACTIVE") { await storage.prisma.project.update({ where: { id: project.id }, data: { status: "LEGACY" } }); return { ok: true, status: "LEGACY" }; }
  return { ok: true, status: project.status };
}
