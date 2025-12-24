import { loadEnv } from "./config/env.js";
import { buildServer } from "./server.js";
async function main() {
  const env = loadEnv(process.env);
  const app = await buildServer(env);
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  app.log.info({ port: env.PORT }, "winmem_api_started");
}
main().catch((err) => { console.error(err); process.exit(1); });
