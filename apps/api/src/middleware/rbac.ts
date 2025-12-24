import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { ApiError } from "../utils/errors.js";
declare module "fastify" { interface FastifyInstance { requireRole: (roles: Array<"admin"|"readonly"|"public">) => (req: any) => void; } }
const plugin: FastifyPluginAsync = async (app) => {
  app.decorate("requireRole", (roles) => (req: any) => {
    const role = req.auth?.role as any;
    if (!role || !roles.includes(role)) throw new ApiError(403, "FORBIDDEN", `Role '${role ?? "none"}' is not allowed`);
  });
};
export default fp(plugin, { name: "rbac" });
