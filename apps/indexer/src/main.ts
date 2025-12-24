import pino from "pino";
import { z } from "zod";
import { Connection, PublicKey } from "@solana/web3.js";

const EnvSchema = z.object({
  WINMEM_LOG_LEVEL: z.string().default("info"),
  WINMEM_RPC_URL: z.string().default("https://api.mainnet-beta.solana.com"),
  WINMEM_STREAM_ADDR: z.string().optional()
});

async function main() {
  const env = EnvSchema.parse(process.env);
  const log = pino({ level: env.WINMEM_LOG_LEVEL });
  const conn = new Connection(env.WINMEM_RPC_URL, "confirmed");

  if (!env.WINMEM_STREAM_ADDR) {
    log.info("WINMEM_STREAM_ADDR not set. Indexer is idle.");
    return;
  }

  const pk = new PublicKey(env.WINMEM_STREAM_ADDR);
  log.info({ addr: pk.toBase58() }, "stream_start");

  let before: string | undefined;
  while (true) {
    const sigs = await conn.getSignaturesForAddress(pk, { limit: 100, before });
    if (sigs.length === 0) { await new Promise(r => setTimeout(r, 1000)); continue; }
    before = sigs[sigs.length - 1].signature;
    log.info({ count: sigs.length, before }, "stream_batch");
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
