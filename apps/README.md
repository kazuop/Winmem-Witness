# Winmem Apps

Runtime services:
- api: HTTP API (Fastify) + Prisma/Postgres
- worker: background jobs (BullMQ + Redis) for ingestion, witness logs, proofs, exports
- indexer: optional high-throughput ingestion scaffold
- web: Next.js UI (retro Windows-style)
- docs-site: placeholder for a static documentation site

English-only, self-hostable.
