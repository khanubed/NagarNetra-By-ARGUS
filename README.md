# NagarNetra

**Mobile Urban Intelligence Platform Using Public Transport Fleet**
Smart India Hackathon · Problem Statement Owner: Bharat Electronics Limited (BEL) · Category: Software · Theme: Smart Automation

---

## 1. Project Overview

NagarNetra turns the existing public bus fleet of a city into a continuous, mobile urban-sensing network. Edge AI running directly on buses detects road defects, traffic conditions, pedestrian risk, and safety incidents from onboard cameras. Instead of stopping at detection, the platform scores risk, clusters recurring problems into accountable black spots, automatically routes issues to the correct civic department under an enforced SLA, and publishes verified, privacy-respecting status to the public.

Where most solutions to this problem statement end at "we found a pothole," NagarNetra's contribution is everything after that: **scoring, routing, tracking, and closing the loop with citizens.**

## 2. Problem Statement

City authorities currently rely on fixed CCTV (static coverage), periodic manual inspection (slow, expensive), and citizen complaints (self-selecting, unverified) to understand road and traffic conditions. This produces delayed response, incomplete situational awareness, and maintenance planning that is reactive rather than evidence-based.

Documented scale of the problem (see [`PRD.md`](./PRD.md) §1 for full citations):

- **155,622** road accident deaths in India in 2021 — highest since 2014 (NCRB)
- **67,387** hit-and-run cases in 2022, only **47.9%** conviction rate (NCRB/MoRTH)
- **~65,000** organized city buses nationally against a **2.86 lakh** benchmark requirement — a 70% fleet deficit
- **0.13–0.32%** of MoRTH's budget spent on road safety (2019–2026)

## 3. Solution Overview

```
BUS CAMERAS → EDGE AI (on-vehicle) → MQTT/HTTPS (events only) → INGESTION
                                                                     │
                                                                     ▼
                                                          URBAN INTELLIGENCE
                                                    (risk scoring, black spots,
                                                       route & city scores)
                                                                     │
                                        ┌────────────────────────────┼────────────────────┐
                                        ▼                            ▼                    ▼
                              GOVERNANCE ENGINE             AUTHORITY DASHBOARD       PUBLIC PORTAL
                          (routing, SLA, escalation)           (command view)        (transparency)
```

Raw video never leaves the bus. Only structured, confirmed, deduplicated events (type, GPS, timestamp, confidence, keyframe image) are transmitted — this is what makes fleet-wide, bandwidth-constrained deployment realistic at city scale.

## 4. USP Overview

Six named capabilities form the product identity — full specifications in [`ARCHITECTURE.md`](./ARCHITECTURE.md) §9–11.

| USP | One-line definition |
|---|---|
| **Urban Risk Index™** | Continuously updated 0–100 composite risk score per ward, combining road damage, traffic density, accident frequency, waterlogging, school proximity, and citizen complaints |
| **Black Spot Intelligence Engine** | Spatial clustering that turns scattered detections into ranked, high-risk road segments with a compound causal profile — "17 potholes, 4 near-misses, school nearby" instead of "pothole found" |
| **Citizen + AI Verification** | Three-tier confidence model: AI detection + citizen confirmation + field-engineer verification compound into a final trust score (e.g. 84% → 97%) |
| **Road Crime Intelligence (ANPR)** | Tamper-evident evidence workflow for hit-and-run/rash-driving, routing tracked vehicle plate OCR and keyframes securely to Traffic Police |
| **Department SLA Engine** | Automatic jurisdiction resolution, department assignment, ticket creation, SLA timers, and rule-based escalation |
| **City Pulse Score™** | Single executive KPI (0–100) aggregating Road Health, Traffic Flow, Public Safety, and Department Efficiency |
| **Route Quality Score™** | Per-bus-route 0–100 grade combining road condition, traffic delay, waterlogging exposure, and safety events |

## 5. Architecture Snapshot

- **Edge layer:** YOLOv11-based detection + ByteTrack tracking + ANPR, quantized (ONNX/TensorRT), running on Jetson-class or Raspberry Pi-class hardware on each bus, fully offline-capable with local buffering.
- **Ingestion layer:** MQTT broker → validation → deduplication → geospatial resolution (ward/zone/segment).
- **Intelligence layer:** Scoring engines (Urban Risk Index, Black Spot clustering, City Pulse, Route Quality) running as scheduled background jobs.
- **Governance layer:** Auto-routing to departments, ticket lifecycle, SLA enforcement, escalation.
- **Presentation layer:** Authority web dashboard, field officer + citizen mobile apps, public transparency portal.

Full detail: [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## 6. Tech Stack Summary

| Layer | Stack |
|---|---|
| Frontend (dashboard & portal) | React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui, Redux Toolkit + RTK Query, Framer Motion, Leaflet/Mapbox, Recharts, TanStack Table |
| Mobile | React Native (field officer + citizen apps) |
| Backend | Node.js, Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL + PostGIS |
| Cache / Queue | Redis, BullMQ |
| Realtime | Socket.IO |
| Edge AI | YOLOv11, ByteTrack, PaddleOCR/EasyOCR, ONNX Runtime / TensorRT |
| Ingestion | MQTT (Mosquitto/EMQX) |
| Storage | S3-compatible object store |
| DevOps | Docker, Docker Compose, GitHub Actions, Nginx |

Full rationale: [`FRONTEND.md`](./FRONTEND.md), [`BACKEND.md`](./BACKEND.md), [`AI_PIPELINES.md`](./AI_PIPELINES.md).

## 7. Setup Guide

### Prerequisites
- Node.js ≥ 20, npm or pnpm
- Docker + Docker Compose
- Python ≥ 3.10 (edge AI tooling only)

### Quick Start (local, all services via Docker Compose)
```bash
git clone <repo-url> nagarnetra
cd nagarnetra
cp .env.example .env          # fill in local secrets
docker compose up -d          # postgres, redis, mqtt, minio
npm install --workspaces
npm run db:migrate            # Prisma migrate + seed
npm run dev                   # starts api, web, worker concurrently
```

### Individual Services
```bash
npm run dev --workspace=apps/api        # backend API + sockets on :4000
npm run dev --workspace=apps/web        # authority dashboard on :5173
npm run dev --workspace=apps/portal     # public portal on :5174
npm run dev --workspace=apps/worker     # background jobs (scoring, SLA, notifications)
```

### Edge AI (simulation mode by default)
```bash
cd edge
pip install -r requirements.txt --break-system-packages
python simulate_fleet.py --buses 12 --speed normal
```

See [`DEVOPS.md`](./DEVOPS.md) for full environment configuration and production deployment.

## 8. Development Guide

- Read [`DEVELOPMENT_SOP.md`](./DEVELOPMENT_SOP.md) before your first commit — it defines branching, commit convention, PR requirements and code review rules.
- Every requirement in this codebase traces to an ID (`FR-<module>-<n>`, `NFR-<category>-<n>`) defined in [`PRD.md`](./PRD.md). Reference these IDs in commits and PRs.
- Documentation is not optional overhead: a change to scoring formulas, the routing matrix, the database schema, or the SLA matrix **must** update the relevant `.md` file in the same PR. Doc drift is treated as a defect (see `DEVELOPMENT_SOP.md` §14).
- Both light and dark themes are first-class everywhere — see [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) before building any UI.

## 9. Documentation Index

| Document | Purpose | Primary Audience |
|---|---|---|
| [`README.md`](./README.md) | This file — entry point and orientation | Everyone |
| [`PRD.md`](./PRD.md) | Vision, requirements, user stories, success metrics | Product, all engineers |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | System design, data flow, scoring engines, infra | All engineers |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | Visual language, tokens, components, accessibility | Frontend, design |
| [`FRONTEND.md`](./FRONTEND.md) | React app structure, state, screens | Frontend engineers |
| [`BACKEND.md`](./BACKEND.md) | API, database, services, RBAC | Backend engineers |
| [`AI_PIPELINES.md`](./AI_PIPELINES.md) | Detection, training, edge deployment | AI/CV engineers |
| [`DEVOPS.md`](./DEVOPS.md) | Docker, CI/CD, environments, monitoring | DevOps |
| [`DEVELOPMENT_SOP.md`](./DEVELOPMENT_SOP.md) | Git workflow, sprints, QA, release process | Project leads, all engineers |

> **Note on figures:** Any statistic in these documents marked *(illustrative)* is a planning estimate for demonstration purposes, not a measured result. Cited national statistics (NCRB/MoRTH/CSE-CITIES) are verifiable and sourced. Do not present illustrative figures as measured outcomes in any pitch, report, or public communication.
