import { z } from "zod";
const EnvSchema = z.object({
  WINMEM_LOG_LEVEL: z.string().default("info"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  WINMEM_QUEUE_PREFIX: z.string().default("winmem"),
  WINMEM_RPC_URL: z.string().default("https://api.mainnet-beta.solana.com"),
  WINMEM_RPC_TIMEOUT_MS: z.coerce.number().default(20000),
  WINMEM_WORKER_CONCURRENCY: z.coerce.number().default(8),
  WINMEM_INGEST_LIMIT: z.coerce.number().default(100),
  WINMEM_WITNESS_CADENCE_SECONDS: z.coerce.number().default(86400)
});
export type Env = z.infer<typeof EnvSchema>;
export function loadEnv(processEnv: NodeJS.ProcessEnv): Env {
  const parsed = EnvSchema.safeParse(processEnv);
  if (!parsed.success) throw new Error(parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; "));
  return parsed.data;
}
