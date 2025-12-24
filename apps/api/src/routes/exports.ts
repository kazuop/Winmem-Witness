import { FastifyPluginAsync } from "fastify";
const routes: FastifyPluginAsync = async (app) => {
  app.get("/v1/projects/:projectId/exports", async (req) => { const { projectId } = req.params as any; return await app.services.exporter.list(projectId); });
  app.post("/v1/projects/:projectId/exports", async (req) => {
    app.requireRole(["admin"])(req);
    const { projectId } = req.params as any;
    const created = await app.services.exporter.create(projectId);
    if (app.queue.enabled()) await app.queue.queue("exports").add("export-snapshot", { projectId, exportId: created.id });
    return created;
  });
  app.get("/v1/exports/:exportId", async (req) => { const { exportId } = req.params as any; return await app.services.exporter.get(exportId); });
};
export default routes;
