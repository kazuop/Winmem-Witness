import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { validateBody } from "../middleware/validation.js";
const routes: FastifyPluginAsync = async (app) => {
  app.get("/v1/projects/:projectId/sources", async (req) => { const { projectId } = req.params as any; return await app.services.source.list(projectId); });
  app.post("/v1/projects/:projectId/sources", async (req) => { app.requireRole(["admin"])(req); const { projectId } = req.params as any; const body = validateBody(z.object({ kind: z.enum(["ADDRESS","PROGRAM","ACCOUNT_SNAPSHOT"]), value: z.string().min(10).max(128) }), req.body); return await app.services.source.add(projectId, body); });
  app.delete("/v1/projects/:projectId/sources/:sourceId", async (req) => { app.requireRole(["admin"])(req); const { projectId, sourceId } = req.params as any; return await app.services.source.remove(projectId, sourceId); });
};
export default routes;
