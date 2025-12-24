import { FastifyPluginAsync } from "fastify";
const routes: FastifyPluginAsync = async (app) => {
  app.get("/v1/projects/:projectId/logs", async (req) => {
    const { projectId } = req.params as any;
    const items = await app.storage.prisma.memory.findMany({ where: { projectId }, orderBy: { createdAt: "desc" }, take: 50 });
    return { items, nextCursor: null };
  });
};
export default routes;
