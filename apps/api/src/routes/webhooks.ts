import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { validateBody } from "../middleware/validation.js";
const routes: FastifyPluginAsync = async (app) => {
  app.get("/v1/projects/:projectId/webhooks", async (req) => { app.requireRole(["admin"])(req); const { projectId } = req.params as any; return await app.services.webhook.list(projectId); });
  app.post("/v1/projects/:projectId/webhooks", async (req) => {
    app.requireRole(["admin"])(req);
    const { projectId } = req.params as any;
    const body = validateBody(z.object({ url: z.string().url(), events: z.array(z.string().min(1)).min(1) }), req.body);
    return await app.services.webhook.create(projectId, body);
  });
  app.patch("/v1/projects/:projectId/webhooks/:id", async (req) => {
    app.requireRole(["admin"])(req);
    const { projectId, id } = req.params as any;
    const body = validateBody(z.object({ enabled: z.boolean() }), req.body);
    return await app.services.webhook.toggle(projectId, id, body.enabled);
  });
};
export default routes;
