import { FastifyPluginAsync } from "fastify";
const routes: FastifyPluginAsync = async (app) => {
  app.get("/v1/auth/whoami", async (req) => ({ requestId: req.requestId, role: req.auth.role, tenantId: req.auth.tenantId }));
};
export default routes;
