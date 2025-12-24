import { Storage } from "../adapters/storage.js";
import { buildMerkleJob } from "../jobs/build-merkle.job.js";
export async function runAuditPipeline(storage: Storage, projectId: string) {
  await buildMerkleJob(storage, { projectId, maxItems: 256 });
}
