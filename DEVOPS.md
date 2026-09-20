# DevOps and Operations — NagarNetra

Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md) §12 · [`BACKEND.md`](./BACKEND.md)

---

## 1. Docker

Multi-stage builds throughout: a build stage compiles (TypeScript, Vite bundles), a runtime stage carries only production dependencies and runs as a non-root user.

```dockerfile
# apps/api/Dockerfile (representative pattern)
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build --workspace=apps/api

FROM node:20-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER app
EXPOSE 4000
CMD ["node", "dist/server.js"]
```

## 2. Docker Compose

```yaml
services:
  api:        # Node.js API + WebSocket
  worker:     # BullMQ job processors
  mqtt:       # Mosquitto broker
  postgres:   # PostgreSQL 16 + PostGIS
  redis:      # Redis 7
  minio:      # S3-compatible object store (local/dev)
  nginx:      # reverse proxy, TLS termination, static hosting
  web:        # built authority dashboard bundle
  portal:     # built public portal bundle
```

Local development brings up `postgres`, `redis`, `mqtt`, `minio` via Compose while `api`/`web`/`portal`/`worker` run through `npm run dev` for hot reload — see `README.md` §Setup Guide.

## 3. CI/CD

| Stage | Actions | Gate |
|---|---|---|
| Lint & Typecheck | ESLint, Prettier check, `tsc --noEmit` | Must pass |
| Unit Tests | Service/utility tests, scoring formula tests | Must pass; coverage floor on scoring + governance modules |
| Integration Tests | API tests against ephemeral Postgres + Redis | Must pass |
| Build | Docker image build, SBOM generation | Must succeed |
| Security Scan | Dependency audit, image vulnerability scan, secret scan | No high/critical findings |
| Migration Check | Prisma migration applied against a production-shaped snapshot | Must apply cleanly and be reversible |
| Deploy dev | Automatic on merge to `develop` | — |
| Deploy staging | Automatic on `release/*` branch | Smoke tests pass |
| Deploy production | Manual approval on tagged release | Approval by engineering lead |

## 4. GitHub Actions

```yaml
# .github/workflows/ci.yml (representative)
name: CI
on:
  pull_request:
  push:
    branches: [develop, main]
jobs:
  lint-test-build:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgis/postgis:16-3.4
        env: { POSTGRES_PASSWORD: test }
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
      - run: npm run migrate:check
      - uses: aquasecurity/trivy-action@master   # image + dependency scan
```

## 5. Environments

| Environment | Purpose | Data | Deploy Trigger |
|---|---|---|---|
| `local` | Developer machines | Seeded synthetic data | Manual |
| `dev` | Integration of merged work | Synthetic, reset nightly | Merge to `develop` |
| `staging` | Pre-release verification and demo | Anonymised production-shaped data | `release/*` branch |
| `production` | Live deployment | Live | Tagged release, manual approval |

## 6. Cloud Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│  BUS EDGE DEVICE   detection · buffer · package · sign      │
└───────────────┬─────────────────────────────────────────────┘
                │  MQTT over TLS
                ▼
┌─────────────────────────────────────────────────────────────┐
│  CLOUD GATEWAY     MQTT broker · device auth · rate limit    │
└───────────────┬─────────────────────────────────────────────┘
                ▼
┌─────────────────────────────────────────────────────────────┐
│  API LAYER (n replicas behind Nginx)                        │
└───┬───────────────┬──────────────────┬─────────────────────-┘
    ▼               ▼                  ▼
PostgreSQL     Redis              Object Store
+ PostGIS      cache/queue        keyframes, evidence
    │               │
    └───────┬───────┘
            ▼
    BullMQ WORKERS
```

Cloud-agnostic: deployable to AWS (RDS+PostGIS, ElastiCache, S3, ECS/EKS), GCP (Cloud SQL, Memorystore, GCS, GKE), or Azure equivalents. Managed Postgres with PostGIS extension enabled is the one hard dependency to verify per provider.

## 7. Monitoring

- Structured JSON logging with a correlation ID propagated from request → job execution → socket emission.
- **Metrics:** ingestion rate, event processing latency, dedup ratio, job queue depth, SLA breach count, socket connection count, API latency percentiles.
- Distributed tracing across API, worker, and database for slow-path diagnosis.
- **Alert thresholds:** ingestion lag > 5 min, queue depth growth sustained over 15 min, device heartbeat loss > 10% of fleet, error rate > 1%.
- Dedicated fleet health view: per-device inference FPS, buffer depth, model version, last heartbeat.

## 8. Logging

- Centralised log aggregation (e.g. Loki/ELK-compatible), retained per the audit log policy (7 years for `audit_logs`; shorter, configurable windows for application debug logs).
- No PII or evidence payload contents in application logs — log references (IDs), never raw plate numbers or citizen contact details.

## 9. Backups

| Aspect | Policy |
|---|---|
| Database backup | Continuous WAL archiving + nightly full snapshot; 30-day retention |
| Object store | Versioned buckets, cross-region replication for the evidence bucket |
| Restore testing | Quarterly restore drill into an isolated environment, with a written result record |

## 10. Disaster Recovery

| Metric | Target |
|---|---|
| Recovery Point Objective (RPO) | 15 minutes for transactional data |
| Recovery Time Objective (RTO) | 4 hours for full service restoration |
| Edge resilience | Devices buffer locally during any outage; zero event loss during a platform restoration window within buffer capacity |

## 11. OTA Updates

```
TRAIN → QUANTISE → EDGE BENCHMARK → ACCEPT
   ▼
VERSIONED MODEL ARTIFACT published to model registry
   ▼
STAGED ROLLOUT   canary fleet subset → monitor FPS/accuracy/thermal → full fleet
   ▼
ROLLBACK CAPABLE   previous model version retained on-device until new version
                    confirmed stable over N heartbeat cycles
```

Model updates never require physical access to a bus — this is central to the fleet-scale cost story in `PRD.md` §Future Scope.

## 12. Scaling Strategy

- API and worker tiers scale horizontally and independently; API is stateless (session state in Redis/JWT), safe to scale on request load.
- Socket.IO uses a Redis adapter for pub/sub fan-out across replicas.
- Database: read replicas for analytics-heavy queries (Risk Analytics, Reports) to keep the transactional primary uncontended.
- Heatmap and aggregate queries are pre-computed and Redis-cached per scope rather than computed on every request (see `ARCHITECTURE.md` §7 performance rule).
- Ingestion throughput scales via MQTT broker clustering and multiple ingestion worker instances consuming from the broker.

## 13. Production Checklist

- [ ] All environment secrets sourced from a managed secret store, none committed to the repository or baked into images.
- [ ] TLS 1.3 enforced on all HTTP/MQTT endpoints; certificate pinning configured on edge devices.
- [ ] Database migrations applied and verified reversible against a production-shaped snapshot.
- [ ] RBAC permission matrix (`BACKEND.md` §13) verified by an access-control test suite, including negative tests confirming restricted data is unreachable from public endpoints.
- [ ] Backup and restore drill completed within the last quarter.
- [ ] Monitoring dashboards and alert thresholds (§7) live and paging the right on-call rotation.
- [ ] Rate limiting active on all public-facing mutation endpoints (citizen reports, verification votes, route planning).
- [ ] OTA model rollout tested end-to-end on at least one canary device before any fleet-wide push.
- [ ] Data retention jobs (`retention:enforce`) verified against the policy table in `BACKEND.md`/`ARCHITECTURE.md` §Security.
- [ ] Both light and dark themes verified on all production-built frontend bundles, not just dev builds.
- [ ] Illustrative/demo figures removed from any production-facing copy — all displayed scores are live-computed.
