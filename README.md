![1500x500](https://github.com/user-attachments/assets/9a473975-7dd8-4005-ac66-659d954d7d5f)

<div align="center">

# Winmem

**A deployable AI runtime that preserves Solana projects in a minimal, durable, auditable state — even when nobody maintains them.**

<a href="https://winmem.tech/">
  <img src="https://img.shields.io/badge/WINMEM-Witness-9945FF?style=for-the-badge&logo=solana&logoColor=white" />
</a>
<a href="https://x.com/Winmemlabs">
  <img src="https://img.shields.io/badge/FOLLOW-@Winmemlabs-1D9BF0?style=for-the-badge" />
</a>

## Verified CA: 8jHrkk6DykU63361DvR2EwaMRpocSQcp1738Jf6Zpump


</div>

---

## What is Winmem?

Winmem is a **self-hostable runtime** that continuously watches Solana activity and produces a **verifiable record** of what a project did — then compresses it into a **minimal existence state** that can persist long after the original team stops maintaining it.

Winmem does **not** replace explorers, indexers, or analytics dashboards.  
It solves a different problem:

> **When a project becomes unattended, Winmem keeps it alive as an auditable, queryable memory.**

---

## Why it matters

Most Solana projects do not disappear because the chain forgets them — the chain does not.  
They disappear because everything around them decays:

- links die  
- documentation rots  
- repositories stall  
- dashboards vanish  
- historical context becomes unreliable  

Winmem makes **project persistence deployable**.

---

## One-line pitch

**Winmem turns Solana projects into durable, verifiable memories.**

---

## Core outputs

Winmem produces four durable layers:

### 1) Witness Logs
A structured, append-only stream of normalized events derived from Solana activity.

### 2) Memory Models
Periodic compression and summarization into durable state:
- deterministic, rule-based compression
- optional LLM-based compression (fully configurable)

### 3) Audit Proofs
Canonical hashing and Merkle roots over event batches, enabling:
- export verification
- tamper evidence
- reproducible integrity checks

### 4) Archive Mode
Freeze a project into a stable snapshot:
- metadata
- compressed memory
- audit proofs
- optional on-chain anchor

---

## What Winmem can track

Winmem supports multiple project targets:

- **Tokens**
  - SPL Token and Token-2022
  - mint, transfer, burn, freeze/thaw
- **NFT collections**
  - Metaplex-related mint and transfer flows
- **Programs**
  - instruction-level activity and account interaction
- **Multi-source projects**
  - multiple RPC providers and mixed targets for resilience

See `examples/configs/projects/*.yaml`.

---

## Architecture (high level)

Winmem is organized as a monorepo:

- **apps/api**
  - authentication, RBAC
  - querying, exports, audit endpoints
- **apps/worker**
  - ingestion pipelines
  - normalization and redaction
  - memory compaction
  - audit proof generation
  - archive lifecycle management
- **apps/web**
  - dashboard UI with retro Windows-style components
- **packages/**
  - core engines and policies
  - Solana parsers and RPC pool
  - cryptography and Merkle tooling
  - storage layers (Postgres, Redis, blobs)
  - LLM adapters and guardrails
  - SDKs and CLI
- **programs/**
  - optional on-chain anchoring (Anchor)

Documentation lives under `docs/`.

---

## Repository layout

```text
.
├─ apps/
│  ├─ api/
│  ├─ worker/
│  ├─ web/
│  └─ indexer/         (optional)
├─ packages/
│  ├─ cli/
│  ├─ core/
│  ├─ solana/
│  ├─ storage/
│  ├─ cryptography/
│  ├─ llm/
│  ├─ observability/
│  └─ sdk-js/
├─ programs/           (optional on-chain program)
├─ infra/              (docker / k8s / helm / terraform)
├─ docs/               (full documentation)
├─ examples/           (configs and deployments)
└─ test/               (fixtures, e2e, load, regression)
```

---

## Quickstart (Docker)

### Requirements

- Node 20+
- pnpm
- Docker

### Run locally

```bash
cp .env.example .env
pnpm install
pnpm dev:up
```

Services:

- Web UI: http://localhost:3000  
- API: http://localhost:8080  
- OpenAPI docs: http://localhost:8080/docs  

---

## CLI workflow

Winmem includes an operator CLI.

```bash
pnpm -w run winmem init
pnpm -w run winmem up

pnpm -w run winmem add-project ./examples/configs/projects/token-project.yaml
pnpm -w run winmem status
pnpm -w run winmem logs --follow
pnpm -w run winmem audit --project token-project
pnpm -w run winmem export --project token-project --format jsonl --proofs
```

---

## Configuration

Winmem uses declarative configuration:

- `winmem.yaml` — runtime configuration
- `projects/*.yaml` — what to track
- policy files:
  - retention
  - redaction
  - sampling

See:
- `examples/configs/winmem.yaml`
- `examples/configs/projects/*.yaml`
- `examples/configs/policies/*.yaml`

---

## Security model (summary)

Winmem is designed for safe self-hosting:

- role-based access control
- rate limiting
- strict input validation
- redaction of sensitive patterns
- audit trails for privileged actions
- optional on-chain anchoring for additional integrity guarantees

Read more in:
- `SECURITY.md`
- `docs/security/*`

---

## Exports and verification

Exports can include:

- canonical events
- compressed memory state
- Merkle proofs
- root hashes
- archive metadata

Verification is possible by:
- recomputing canonical hashes
- rebuilding Merkle trees
- matching on-chain anchors (if enabled)

---

## Deployment options

Winmem supports:

- Docker Compose
- Kubernetes (Kustomize)
- Helm
- optional Terraform modules

Start with:
- `docs/deployment/quickstart-docker.md`
- `docs/deployment/self-hosting.md`
- `docs/deployment/kubernetes.md`
- `docs/deployment/helm.md`

---

## Development

```bash
./scripts/bootstrap.sh
./scripts/lint.sh
./scripts/test.sh
./scripts/build.sh
```

Additional tools:
- `./scripts/generate-openapi.sh`
- `./scripts/generate-types.sh`
- `./scripts/db-migrate.sh`
- `./scripts/db-reset.sh`

---

## Contributing

Contributions are welcome.

- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`

---

## License

Winmem is dual-licensed under **MIT** or **Apache-2.0**.  
See `LICENSE`.

---

## Disclaimer

Winmem is archival and auditing software.  
It is **not financial advice**.

See `DISCLAIMER.md`.

---

## Links

- Website: https://winmem.tech/
- X: https://x.com/Winmemlabs
