import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import CryptoJS from "crypto-js";
import { ApiError } from "../utils/errors.js";

export type AuthContext = { role: "admin" | "readonly" | "public"; tenantId: string; };
declare module "fastify" { interface FastifyRequest { auth: AuthContext; } }

function hashKey(key: string): string {
  return CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
}

const plugin: FastifyPluginAsync = async (app) => {
  const env = app.env;
  const adminHash = hashKey(env.WINMEM_API_KEY_ADMIN);
  const roHash = hashKey(env.WINMEM_API_KEY_READONLY);

  app.decorateRequest("auth", null as any);

  app.addHook("preHandler", async (req) => {
    const header = req.headers["x-winmem-api-key"];
    const key = typeof header === "string" ? header : "";
    if (!key) {
      if (env.WINMEM_PUBLIC_MODE) { req.auth = { role: "public", tenantId: "public" }; return; }
      throw new ApiError(401, "UNAUTHENTICATED", "Missing API key");
    }
    const h = hashKey(key);
    if (h === adminHash) { req.auth = { role: "admin", tenantId: "public" }; return; }
    if (h === roHash) { req.auth = { role: "readonly", tenantId: "public" }; return; }
    throw new ApiError(403, "FORBIDDEN", "Invalid API key");
  });
};
export default fp(plugin, { name: "auth" });
