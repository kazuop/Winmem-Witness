import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { validateBody, validateQuery } from "../middleware/validation.js";
const CreateSchema = z.object({ name: z.string().min(2).max(64), description: z.string().max(500).optional(), cluster: z.enum(["mainnet-beta","testnet","devnet"]) });
const ListQuery = z.object({ limit: z.coerce.number().min(1).max(200).default(50), cursor: z.string().optional() });
const routes: FastifyPluginAsync = async (app) => {
  app.get("/v1/projects", async (req) => { const q = validateQuery(ListQuery, req.query); return await app.services.project.list(req.auth.tenantId, q.limit, q.cursor); });
  app.post("/v1/projects", async (req) => { app.requireRole(["admin"])(req); const body = validateBody(CreateSchema, req.body); return await app.services.project.create(req.auth.tenantId, body); });
  app.get("/v1/projects/:projectId", async (req) => { const { projectId } = req.params as any; return await app.services.project.get(req.auth.tenantId, projectId); });
  app.patch("/v1/projects/:projectId/status", async (req) => { app.requireRole(["admin"])(req); const { projectId } = req.params as any; const body = validateBody(z.object({ status: z.enum(["ACTIVE","LEGACY","ARCHIVED"]) }), req.body); return await app.services.project.updateStatus(req.auth.tenantId, projectId, body.status); });
};
export default routes;
