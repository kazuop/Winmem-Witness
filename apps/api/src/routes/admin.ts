import { FastifyPluginAsync } from "fastify";
const routes: FastifyPluginAsync = async (app) => {
  app.get("/v1/admin/stats", async (req) => {
    app.requireRole(["admin"])(req);
    const projects = await app.storage.prisma.project.count();
    const events = await app.storage.prisma.event.count();
    const memories = await app.storage.prisma.memory.count();
    const batches = await app.storage.prisma.auditBatch.count();
    return { projects, events, memories, batches };
  });
};
export default routes;
