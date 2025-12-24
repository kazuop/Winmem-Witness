import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(8787),
  WINMEM_LOG_LEVEL: z.string().default("info"),
  WINMEM_PUBLIC_MODE: z.coerce.boolean().default(false),
  WINMEM_CORS_ORIGINS: z.string().default("http://localhost:3000"),
  WINMEM_RATE_LIMIT_RPM: z.coerce.number().default(600),

  WINMEM_API_KEY_ADMIN: z.string().min(8),
  WINMEM_API_KEY_READONLY: z.string().min(8),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1).optional(),

  WINMEM_RPC_URL: z.string().default("https://api.mainnet-beta.solana.com"),
  WINMEM_RPC_TIMEOUT_MS: z.coerce.number().default(20000),
  WINMEM_RPC_RETRIES: z.coerce.number().default(5),

  WINMEM_REDACTION_ENABLED: z.coerce.boolean().default(true)
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(processEnv: NodeJS.ProcessEnv): Env {
  const parsed = EnvSchema.safeParse(processEnv);
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid environment: ${msg}`);
  }
  return parsed.data;
}
