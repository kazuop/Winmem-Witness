import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { nanoid } from "nanoid";
declare module "fastify" { interface FastifyRequest { requestId: string; } }
const plugin: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", async (req, reply) => {
    const incoming = req.headers["x-request-id"];
    const rid = typeof incoming === "string" && incoming.length ? incoming : nanoid(12);
    req.requestId = rid;
    reply.header("x-request-id", rid);
  });
};
export default fp(plugin, { name: "requestId" });
