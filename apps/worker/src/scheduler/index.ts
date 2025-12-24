import cron from "node-cron";
import { Storage } from "../adapters/storage.js";
import { SolanaClient } from "../adapters/solana.js";
import { runIngestionPipeline } from "../pipelines/ingestion.pipeline.js";
import { runMemoryPipeline } from "../pipelines/memory.pipeline.js";
import { runAuditPipeline } from "../pipelines/audit.pipeline.js";
import { detectLifecycleJob } from "../jobs/detect-lifecycle.job.js";

export function startScheduler(opts: { storage: Storage; solana: SolanaClient; ingestLimit: number; cadenceSeconds: number; }) {
  cron.schedule("* * * * *", async () => {
    const projects = await opts.storage.prisma.project.findMany();
    for (const p of projects) { if (p.status === "ARCHIVED") continue; await runIngestionPipeline(opts.storage, opts.solana, p.id, opts.ingestLimit); }
  });
  cron.schedule("0 * * * *", async () => {
    const projects = await opts.storage.prisma.project.findMany();
    for (const p of projects) {
      if (p.status === "ARCHIVED") continue;
      await runMemoryPipeline(opts.storage, p.id, opts.cadenceSeconds);
      await runAuditPipeline(opts.storage, p.id);
      await detectLifecycleJob(opts.storage, { projectId: p.id, legacyDays: 30, archiveDays: 180 });
    }
  });
}
