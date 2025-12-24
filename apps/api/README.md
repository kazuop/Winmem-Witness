# Winmem API

Fastify + Prisma API service.

Exposes:
- health + metrics
- auth (whoami)
- projects
- sources
- events
- memories (witness logs)
- audits (Merkle proofs)
- archives + exports
- webhooks
- admin stats

## Quickstart (dev)

```bash
cd apps/api
cp .env.example .env
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

Open:
- API: http://localhost:8787
- Docs: http://localhost:8787/docs
