# Winmem Deployment Documentation (Single File)

This document consolidates all Winmem deployment documentation into a single,
self-contained file. It does not alter the meaning or structure of the original
documents; it simply merges them for portability, offline reading, and archival
purposes.

---

## 1. Overview

Winmem is designed to run as long-lived infrastructure. Deployments are expected
to remain operational even when the original development team is no longer
active.

Supported environments:
- Local development
- Self-hosted servers
- Kubernetes clusters
- Helm-managed environments

---

## 2. Quickstart: Docker Compose

### Requirements
- Docker >= 24
- Docker Compose v2
- Node.js 20+ (optional, for CLI usage)

### Steps

```bash
cp .env.example .env
docker compose -f infra/docker/docker-compose.yml up -d
```

### Services
- API: http://localhost:8080
- Web UI: http://localhost:3000
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

Docker Compose is recommended for local testing and small-scale deployments.

---

## 3. Self-Hosting

Winmem is fully self-hostable and does not require external SaaS services.

### Core Components
- API service
- Worker service
- Web UI
- PostgreSQL
- Redis

Optional components:
- ClickHouse (high-throughput event storage)
- Grafana / Prometheus / Loki / Tempo

### Configuration
All configuration is driven by environment variables and YAML configuration files.
Refer to `.env.example` and `winmem.yaml` for the full configuration surface.

---

## 4. Kubernetes Deployment

Winmem supports Kubernetes via raw manifests and Kustomize overlays.

### Structure
- `infra/k8s/base`: base manifests
- `infra/k8s/overlays`: environment-specific overlays (dev, prod)

### Deploy

```bash
kubectl apply -k infra/k8s/overlays/prod
```

### Features
- Horizontal Pod Autoscaling
- ConfigMaps and Secrets
- Ingress support
- Stateless API and Worker services

---

## 5. Helm Deployment

Winmem provides an official Helm chart.

### Install

```bash
helm install winmem infra/helm/winmem -f values.prod.yaml
```

### Configuration
All services can be configured via `values.yaml`. Secrets should be injected
through external secret managers or Kubernetes Secrets.

---

## 6. Solana RPC Recommendations

Winmem is RPC-intensive by design.

### Best Practices
- Use multiple RPC providers
- Enable RPC pooling and rotation
- Avoid free public RPC endpoints in production

### Supported Providers
- Helius
- Triton
- QuickNode
- Self-hosted Solana RPC nodes

---

## 7. Scaling Strategy

### API Service
- Stateless
- Horizontally scalable

### Worker Service
- Queue-based processing
- Scale by increasing replica count

### Storage
- PostgreSQL: vertical scaling + read replicas
- Redis: optional cluster mode

---

## 8. Backups and Recovery

### PostgreSQL
- Daily logical backups
- Point-in-time recovery recommended

### Object Storage
- Snapshot exports should be versioned and immutable

### Restore
Database restoration can be performed using the provided scripts:
- `scripts/backup-db.sh`
- `scripts/restore-db.sh`

---

## 9. Operational Notes

- Always pin Docker image versions in production
- Monitor RPC error rates and latency
- Treat archive snapshots as immutable artifacts
- Store audit proofs separately from live databases

---

## 10. Deployment Philosophy

Winmem is designed to remain operational even when unattended.

A correct deployment:
- Requires minimal human intervention
- Produces verifiable outputs
- Can be audited long after active development ends

This is not a hosting guide for short-lived demos.
It is infrastructure for long-term memory preservation.
