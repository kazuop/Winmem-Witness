import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import requestId from "./middleware/requestId.js";
import rateLimit from "./middleware/rateLimit.js";
import auth from "./middleware/auth.js";
import rbac from "./middleware/rbac.js";
import errorHandler from "./middleware/errorHandler.js";

import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import sourcesRoutes from "./routes/sources.js";
import eventsRoutes from "./routes/events.js";
import memoriesRoutes from "./routes/memories.js";
import logsRoutes from "./routes/logs.js";
import auditsRoutes from "./routes/audits.js";
import archivesRoutes from "./routes/archives.js";
import exportsRoutes from "./routes/exports.js";
import webhooksRoutes from "./routes/webhooks.js";
import adminRoutes from "./routes/admin.js";

import { StorageAdapter } from "./adapters/storage.adapter.js";
import { QueueAdapter } from "./adapters/queue.adapter.js";
import { SolanaAdapter } from "./adapters/solana.adapter.js";
import { BlobAdapter } from "./adapters/blob.adapter.js";
import { LlmAdapter } from "./adapters/llm.adapter.js";

import { ProjectService } from "./services/project.service.js";
import { SourceService } from "./services/source.service.js";
import { EventService } from "./services/event.service.js";
import { MemoryService } from "./services/memory.service.js";
import { AuditService } from "./services/audit.service.js";
import { ArchiveService } from "./services/archive.service.js";
import { ExportService } from "./services/export.service.js";
import { WebhookService } from "./services/webhook.service.js";

import type { Env } from "./config/env.js";

declare module "fastify" {
  interface FastifyInstance {
    env: Env;
    storage: StorageAdapter;
    queue: QueueAdapter;
    solana: SolanaAdapter;
    blob: BlobAdapter;
    llm: LlmAdapter;
    services: {
      project: ProjectService;
      source: SourceService;
      event: EventService;
      memory: MemoryService;
      audit: AuditService;
      archive: ArchiveService;
      exporter: ExportService;
      webhook: WebhookService;
    };
  }
}

export async function buildServer(env: Env) {
  const app = Fastify({ logger: { level: env.WINMEM_LOG_LEVEL } });
  app.decorate("env", env);

  const storage = new StorageAdapter();
  const queue = new QueueAdapter({ redisUrl: env.REDIS_URL, prefix: process.env.WINMEM_QUEUE_PREFIX ?? "winmem" });
  const solana = new SolanaAdapter({ rpcUrl: env.WINMEM_RPC_URL, timeoutMs: env.WINMEM_RPC_TIMEOUT_MS });
  const blob = new BlobAdapter();
  const llm = new LlmAdapter();

  app.decorate("storage", storage);
  app.decorate("queue", queue);
  app.decorate("solana", solana);
  app.decorate("blob", blob);
  app.decorate("llm", llm);

  app.decorate("services", {
    project: new ProjectService(storage),
    source: new SourceService(storage),
    event: new EventService(storage),
    memory: new MemoryService(storage),
    audit: new AuditService(storage),
    archive: new ArchiveService(storage),
    exporter: new ExportService(storage, blob),
    webhook: new WebhookService(storage)
  });

  await app.register(helmet);
  await app.register(cors, { origin: env.WINMEM_CORS_ORIGINS.split(",").map(s => s.trim()) });
  await app.register(swagger, { openapi: { info: { title: "Winmem API", version: "0.1.0" } } });
  await app.register(swaggerUi, { routePrefix: "/docs" });

  await app.register(requestId);
  await app.register(rateLimit);
  await app.register(auth);
  await app.register(rbac);
  await app.register(errorHandler);

  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(projectsRoutes);
  await app.register(sourcesRoutes);
  await app.register(eventsRoutes);
  await app.register(memoriesRoutes);
  await app.register(logsRoutes);
  await app.register(auditsRoutes);
  await app.register(archivesRoutes);
  await app.register(exportsRoutes);
  await app.register(webhooksRoutes);
  await app.register(adminRoutes);

  app.addHook("onClose", async () => { await storage.close(); });
  return app;
}
