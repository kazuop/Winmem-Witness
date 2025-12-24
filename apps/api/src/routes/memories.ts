import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { validateQuery } from "../middleware/validation.js";
const ListQuery = z.object({ limit: z.coerce.number().min(1).max(200).default(50), cursor: z.string().optional(), kind: z.string().optional() });
const routes: FastifyPluginAsync = async (app) => {
  app.get("/v1/projects/:projectId/memories", async (req) => { const { projectId } = req.params as any; const q = validateQuery(ListQuery, req.query); return await app.services.memory.list(projectId, q.limit, q.cursor, q.kind); });
};
export default routes;
