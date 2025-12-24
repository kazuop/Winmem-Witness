import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { ApiError, sendError } from "../utils/errors.js";
const plugin: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((err, req, reply) => {
    const requestId = (req as any).requestId ?? "unknown";
    if (err instanceof ApiError) return sendError(reply, requestId, err);
    app.log.error({ requestId, err }, "unhandled_error");
    return reply.status(500).send({ requestId, code: "INTERNAL_ERROR", message: "Unexpected error" });
  });
};
export default fp(plugin, { name: "errorHandler" });
