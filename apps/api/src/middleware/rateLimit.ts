import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
const plugin: FastifyPluginAsync = async (app) => {
  await app.register(rateLimit, {
    max: app.env.WINMEM_RATE_LIMIT_RPM,
    timeWindow: "1 minute",
    keyGenerator: (req) => {
      const k = req.headers["x-winmem-api-key"];
      if (typeof k === "string" && k.length) return k.slice(0, 16);
      return req.ip;
    }
  });
};
export default fp(plugin, { name: "rateLimit" });
