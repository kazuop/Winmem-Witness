import { FastifyPluginAsync } from "fastify";
import { registry } from "../telemetry/metrics.js";
const routes: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => { await app.storage.health(); return { ok: true, service: "winmem-api" }; });
  app.get("/metrics", async (_req, reply) => { reply.header("content-type", registry.contentType); return await registry.metrics(); });
};
export default routes;
