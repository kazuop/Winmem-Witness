import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { validateQuery } from "../middleware/validation.js";
const BatchesQuery = z.object({ limit: z.coerce.number().min(1).max(200).default(50) });
const ProofQuery = z.object({ leaf: z.string().min(16) });
const routes: FastifyPluginAsync = async (app) => {
  app.get("/v1/projects/:projectId/audits/batches", async (req) => { const { projectId } = req.params as any; const q = validateQuery(BatchesQuery, req.query); return await app.services.audit.listBatches(projectId, q.limit); });
  app.get("/v1/audits/proof", async (req) => { const q = validateQuery(ProofQuery, req.query); return await app.services.audit.getProofByLeaf(q.leaf); });
};
export default routes;
