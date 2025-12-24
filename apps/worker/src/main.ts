import pino from "pino";
import { loadEnv } from "./config/env.js";
import { Storage } from "./adapters/storage.js";
import { SolanaClient } from "./adapters/solana.js";
import { createWorker } from "./queues/index.js";
import { exportSnapshotJob } from "./jobs/export-snapshot.job.js";
import { startScheduler } from "./scheduler/index.js";

async function main() {
  const env = loadEnv(process.env);
  const log = pino({ level: env.WINMEM_LOG_LEVEL });

  const storage = new Storage();
  const solana = new SolanaClient(env.WINMEM_RPC_URL, env.WINMEM_RPC_TIMEOUT_MS);

  const exportsWorker = createWorker(
    env.REDIS_URL,
    env.WINMEM_QUEUE_PREFIX,
    "exports",
    async (job) => {
      const { projectId, exportId } = job.data as any;
      log.info({ projectId, exportId }, "export_job_start");
      const res = await exportSnapshotJob(storage, { projectId, exportId });
      log.info({ res }, "export_job_done");
      return res;
    },
    Math.max(1, Math.min(env.WINMEM_WORKER_CONCURRENCY, 8))
  );

  exportsWorker.on("failed", (job, err) => log.error({ jobId: job?.id, err }, "job_failed"));

  startScheduler({ storage, solana, ingestLimit: env.WINMEM_INGEST_LIMIT, cadenceSeconds: env.WINMEM_WITNESS_CADENCE_SECONDS });

  log.info("winmem_worker_started");

  process.on("SIGINT", async () => {
    log.info("shutting_down");
    await exportsWorker.close();
    await storage.close();
    process.exit(0);
  });
}
main().catch((err) => { console.error(err); process.exit(1); });
