import { Storage } from "../adapters/storage.js";
import { summarizeWitnessJob } from "../jobs/summarize-witness.job.js";
export async function runMemoryPipeline(storage: Storage, projectId: string, cadenceSeconds: number) {
  await summarizeWitnessJob(storage, { projectId, cadenceSeconds });
}
