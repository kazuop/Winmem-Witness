# Winmem Worker

Background ingestion + witness + audit + export.

It can run in two modes at the same time:
- BullMQ queue processors (exports queue is implemented end-to-end)
- Cron scheduler (small ingestion + witness logs + audit batches)

## Quickstart

```bash
cd apps/worker
cp .env.example .env
pnpm install
pnpm dev
```
