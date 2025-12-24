import { Storage } from "../adapters/storage.js";
import { SolanaClient } from "../adapters/solana.js";
import { ingestSignaturesJob } from "../jobs/ingest-signatures.job.js";
import { fetchTransactionsJob } from "../jobs/fetch-transactions.job.js";
import { normalizeEventsJob } from "../jobs/normalize-events.job.js";
export async function runIngestionPipeline(storage: Storage, solana: SolanaClient, projectId: string, limit: number) {
  await ingestSignaturesJob(storage, solana, { projectId, limit });
  await fetchTransactionsJob(storage, solana, { projectId, limit });
  await normalizeEventsJob(storage, { projectId, limit });
}
