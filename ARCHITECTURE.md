# Technical Architecture — NagarNetra

Related: [`README.md`](./README.md) · [`PRD.md`](./PRD.md) · [`BACKEND.md`](./BACKEND.md) · [`AI_PIPELINES.md`](./AI_PIPELINES.md) · [`DEVOPS.md`](./DEVOPS.md)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  BUS EDGE DEVICE   detection · buffer · package · sign      │
└───────────────┬─────────────────────────────────────────────┘
                │  MQTT over TLS (events only, never raw video)
                ▼
┌─────────────────────────────────────────────────────────────┐
│  CLOUD GATEWAY     MQTT broker · device auth · rate limit    │
└───────────────┬─────────────────────────────────────────────┘
                ▼
┌─────────────────────────────────────────────────────────────┐
│  API LAYER (n replicas behind Nginx)                        │
│  REST · WebSocket · ingestion workers                       │
└───┬───────────────┬──────────────────┬─────────────────────-┘
    ▼               ▼                  ▼
PostgreSQL     Redis              Object Store
+ PostGIS      cache/queue        keyframes, evidence
    │               │
    └───────┬───────┘
            ▼
    BullMQ WORKERS   scoring · clustering · SLA · reports · notify
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│  CLIENTS   Authority Dashboard · Field App · Citizen App     │
│            Public Portal                                     │
└─────────────────────────────────────────────────────────────┘
```

## 2. System Design — Functional Requirements Summary

Full requirement tables with acceptance criteria live in the module sections below. IDs follow `FR-<module>-<n>`.

### 2.1 Module 1 — Edge AI Detection

| ID | Requirement | Priority |
|---|---|---|
| FR-EDGE-01/02/03/04/05/06 | Pothole, crack, divider, signboard, zebra crossing, waterlogging detection | MUST/SHOULD |
| FR-EDGE-07/08/09/10/11 | Vehicle detection, classification, counting, density, congestion | MUST |
| FR-EDGE-12/13/14/15/16 | Pedestrian, school-zone risk, rash driving, near-miss, hit-and-run | MUST/SHOULD |
| FR-EDGE-17/18/19/20 | Plate localisation, OCR, confidence, evidence packet generation | MUST |

### 2.2 Module 2 — Edge Processing Engine

| ID | Requirement | Priority |
|---|---|---|
| FR-EPE-01 | On-device inference only, no remote frame processing | MUST |
| FR-EPE-02 | Full offline operation ≥8 hours | MUST |
| FR-EPE-03 | Durable local event buffer surviving restarts | MUST |
| FR-EPE-04 | Multi-frame confirmation before event emission | MUST |
| FR-EPE-05 | Location + class deduplication with observation-count increment | MUST |
| FR-EPE-06/07 | GPS tagging interpolated to frame time; UTC timestamping with skew correction | MUST |
| FR-EPE-08 | Compressed annotated keyframe packaging | MUST |
| FR-EPE-09 | Auto-sync on reconnect, oldest-first, at-least-once delivery | MUST |
| FR-EPE-10 | Device health telemetry heartbeat | SHOULD |

### 2.3 Module 3 — Urban Intelligence Platform

| ID | Requirement | Priority |
|---|---|---|
| FR-UIP-01/02/03 | Authenticated ingestion, canonical classification, spatial resolution (ward/zone/segment) | MUST |
| FR-UIP-04 | Urban Risk Index computation per ward/zone, versioned | MUST |
| FR-UIP-05 | Black spot detection and stable-identity clustering | MUST |
| FR-UIP-06 | Trend analysis over configurable periods | SHOULD |
| FR-UIP-07/08 | Route Quality Score, route delay estimation | MUST/SHOULD |
| FR-UIP-09/10 | OD pattern analysis, deterioration forecasting | MAY (future) |

### 2.4 Module 4 — Governance Automation Engine

| ID | Requirement | Priority |
|---|---|---|
| FR-GOV-01 | Auto-assign department via versioned routing matrix | MUST |
| FR-GOV-02/03 | Ticket creation with frozen SLA target at creation time | MUST |
| FR-GOV-04 | Full audited state-transition history | MUST |
| FR-GOV-05 | Automatic SLA-breach escalation to successively senior roles | MUST |
| FR-GOV-06 | Linked tickets for multi-department black spots | SHOULD |
| FR-GOV-07/08/09 | Citizen + engineer verification signals compounding into final confidence | MUST |
| FR-GOV-10 | Multi-channel notification on state change | MUST |

### 2.5 Module 5 — Road Crime Intelligence (Hit-and-Run & ANPR)

| ID | Requirement | Priority |
|---|---|---|
| RC-1 | Trigger incident heuristics only on collision-signature or sudden-departure patterns | P0 |
| RC-2 | Track offending vehicle across minimum 5 consecutive frames | P0 |
| RC-3 | Extract plate text with per-character and overall OCR confidence | P0 |
| RC-4 | Validate plate format against Indian plate regex | P0 |
| RC-5 | Package evidence: minimum 3 keyframes, GPS, heading, speed, UTC timestamp | P0 |
| RC-6 | Hash every frame and sign packet hash with device's private key | P0 |
| RC-7 | Incident-class events bypass normal transmission queueing | P0 |
| RC-8 | Auto-create Case routed exclusively to Traffic Police | P0 |
| RC-10 | Evidence packets are immutable once stored | P0 |
| RC-11 | Every view of restricted incident/plate data is audit-logged | P0 |
| RC-14 | Restricted data never reachable via any public-facing endpoint | P0 |

## 3. Edge AI Architecture

Full pipeline, model inventory, dataset/training/evaluation strategy: [`AI_PIPELINES.md`](./AI_PIPELINES.md).

```
CAMERA FRAME → PRE-PROCESS → YOLOv11 DETECTOR → TRACKER (ByteTrack) → CLASS ROUTER
                                                                          │
              ┌───────────────────────────────┬──────────────────────────┤
              ▼                               ▼                          ▼
      defect track                    vehicle track               person track
      → multi-frame confirm           → counting/density          → proximity/school-zone risk
      → severity estimate                                              │
                                                                         ▼
                                                              incident trigger → ANPR
                                                                         │
                                                                         ▼
                                                        EVENT GENERATOR (dedup, GPS/time,
                                                          keyframe, package) → TRANSMIT
```

**Sensor fusion fallback:** camera detection degrades at night, in glare, and heavy rain. The edge unit's IMU (accelerometer/gyroscope) detects impact-like spikes independently of vision; vision + IMU agreement raises confidence, IMU-only creates a low-confidence "suspected defect" routed to the verification queue rather than a direct ticket. Full detail: `AI_PIPELINES.md` §Risk & Verification Logic.

## 4. Backend Architecture

Full detail: [`BACKEND.md`](./BACKEND.md).

```
HTTP / MQTT / WS entry
      ▼
ROUTE LAYER        request binding, schema validation (Zod)
      ▼
CONTROLLER LAYER   auth, RBAC, jurisdiction scoping, response shaping
      ▼
SERVICE LAYER      business rules, orchestration, transactions
      ▼
REPOSITORY LAYER   Prisma queries, spatial queries, no business logic
      ▼
DATABASE / CACHE / OBJECT STORE
```

## 5. Authority Dashboard — Page Inventory

| Page | Purpose |
|---|---|
| Dashboard | Single-screen command overview: City Pulse gauge, live feed, KPI cards, mini-map |
| Alerts | Priority triage for high-severity/time-critical events |
| Heatmaps | Multi-layer spatial density (defects, traffic, waterlogging, incidents) |
| Black Spots | Ranked clustered high-risk segments with causal profile |
| Road Health | Segment-level condition scores and maintenance planning |
| Traffic Analytics | Corridor performance, bottlenecks, route delay, OD summary |
| Risk Analytics | Urban Risk Index leaderboard with full factor transparency |
| Department Performance | SLA compliance, resolution time, escalation, reopen rate per department |
| City Pulse Score | Executive single-KPI view with component decomposition |
| Reports | Templated report generation, scheduling, archive |
| Users | Account, role, and jurisdiction administration |
| Settings | SLA matrix, routing matrix, risk weights, thresholds — Super Admin only |
| Audit Logs | Immutable record of every consequential action |
| Road Crimes (Restricted) | Command Center, Case Detail (Evidence Viewer), Repeat Offenders, Hotspots |

Full component/chart/filter/permission/API specification per page: see the SRS-level detail retained in project history; this file gives architectural scope, `FRONTEND.md` gives implementation structure.

## 6. Public Transparency Portal — Page Inventory

| Page | Purpose |
|---|---|
| Public Home Dashboard | City Pulse, Urban Risk Index, active/resolved issues, live map |
| Smart Route Planner | 4 ranked route options (fastest/safest/best road quality/lowest congestion) with segment colour-coding |
| City Road Health Map | Segment-scored interactive map with defect layer filters |
| Black Spot Explorer | Public black-spot cards with causal factor breakdown |
| AI Verification Center | Citizen confirm/reject/comment on AI detections |
| Issue Tracking Portal | Public per-issue page with full status timeline |
| Public Transparency Dashboard | Department scorecards (SLA compliance, resolution time) |
| Ward Intelligence | Per-ward score profile and rankings |
| Alert Center | Citizen subscriptions across push/WhatsApp/SMS/email |
| Civic Participation Hub | Voting, reporting, verification, feedback |

**Non-negotiable rule:** restricted-class events (hit-and-run, rash driving, near-miss detail, plate data) are never reachable from any `/public/*` endpoint under any parameter combination — enforced at the repository layer, not the controller.

## 7. GIS Architecture

```sql
-- Ward containment
SELECT id FROM wards
WHERE ST_Contains(boundary::geometry, ST_SetSRID(ST_Point($lng,$lat),4326))
LIMIT 1;

-- Nearest road segment within 25m
SELECT id, ST_Distance(geometry, $point::geography) AS d
FROM road_segments
WHERE ST_DWithin(geometry, $point::geography, 25)
ORDER BY d ASC LIMIT 1;

-- School zone geofence (200m buffer)
SELECT EXISTS (
  SELECT 1 FROM school_zones
  WHERE ST_DWithin(boundary, $point::geography, 200)
) AS in_school_zone;
```

**Performance rule:** spatial joins happen once, at ingestion. All read-path queries filter on the denormalised `ward_id` / `road_segment_id` columns stored on the event. Running `ST_Contains` on every dashboard request is prohibited — it will not scale.

| Use Case | Approach |
|---|---|
| Nearby-event dedup | `ST_DWithin` on geography, class + time-window filter, GIST-indexed |
| Heatmap generation | `ST_SnapToGrid` aggregation, cached in Redis per scope |
| Black spot clustering | `ST_ClusterDBSCAN` over event points (eps=75m, minpoints=5) |
| Route coverage | `ST_Buffer` of route linestring intersected with road segments |

## 8. Security Architecture

Full detail: [`BACKEND.md`](./BACKEND.md) §Authentication/RBAC.

- JWT access (15 min) + rotating refresh (7 days) with reuse-detection revocation.
- Per-device credentials for edge units — a compromised device is revocable individually.
- Evidence integrity via hash-chained packets, signed at the edge:
  ```
  packet_hash = SHA-256(canonical_json(payload))
  signature = sign(packet_hash, device_private_key)
  ```
  Each packet embeds the previous packet's hash (per-device hash chain) — retroactive alteration is detectable.
- **Law-Enforcement Evidence Workflow:** The system generates BSA Section 63 compliant evidence certificates (tamper-evident packet hash + device ID + timestamp) for hit-and-run cases. These are routed exclusively to Traffic Police.
- **Framing discipline:** the platform produces *tamper-evident* evidence. It does not assert legal admissibility — that is a determination for the competent authority. Never claim "court-admissible" in product copy.
- ANPR runs only on incident-flagged tracks, never as a continuous surveillance sweep. No facial recognition anywhere in the pipeline.

## 9. Urban Risk Index™ — Engine

**Factors and weights:**

| Factor | Weight | Derivation |
|---|---|---|
| Road Damage | 0.25 | Defect density × severity per km |
| Traffic Density | 0.15 | Mean observed vehicle density, normalised city-wide |
| Accident Frequency | 0.25 | Incident + near-miss events per km, severity-weighted |
| Waterlogging | 0.12 | Recurrence across distinct days |
| School Proximity | 0.13 | Share of risk events within school-zone geofences |
| Citizen Complaints | 0.10 | Verified reports per 1,000 residents |

```
Nᵢ = 100 × (xᵢ − p5ᵢ) / (p95ᵢ − p5ᵢ)    clamped [0,100]   (robust min-max per period)

URI(u) = Σ(wᵢ × Nᵢ(u))    for i = 1..6,  Σwᵢ = 1

Recency weight:   r(e) = exp(−0.023 × age_days(e))     (~30-day half-life)
Severity weight:  low=1, medium=2, high=4, critical=8
Confidence gate:  event contributes only if final_confidence ≥ 70,
                  contribution scaled by (final_confidence / 100)
```

**Convention:** higher Urban Risk Index = more risk (inverse of City Pulse Score — always label direction explicitly).

**Composite confidence model** (implements Citizen + AI Verification USP):
```
Start:  C = ai_confidence                          e.g. 84

Citizen signal:
  net = Σ(vote × reputation_weight) over distinct citizens
  if net > 0:  C = C + (100−C) × min(0.45, 0.15×√net)
  if net < 0:  C = C − C × min(0.50, 0.15×√|net|)

Engineer signal (authoritative):
  confirmed: C = max(C, 95)
  rejected:  C = min(C, 10)  → event status = REJECTED

Example: AI 84 + citizen verified (net +3) → ≈88 + engineer verified → 95
```

## 10. Black Spot Intelligence Engine

```
INPUT: events in analysis window (90 days), confidence ≥70, not rejected
  1. SPATIAL CLUSTER   ST_ClusterDBSCAN(location, eps=75m, minpoints=5)
  2. FILTER            discard clusters >250m span or <3 distinct observation days
  3. CHARACTERISE       factor profile, centroid, convex hull
  4. IDENTITY MATCH     match to existing spot by centroid <50m (stable IDs)
  5. SCORE & RANK

Black Spot Score (0–100):
  BSS = 100 × (0.30×D̂ + 0.25×Î + 0.15×T̂ + 0.12×Ŵ + 0.10×Ŝ + 0.08×Ĉ)
    D̂=defect burden  Î=incident/near-miss burden  T̂=traffic density
    Ŵ=waterlogging   Ŝ=school proximity (1.0 within 200m, decay to 500m)  Ĉ=citizen reports

Recurrence multiplier: R = 1 + 0.05×(observation_days−3), capped 1.5
Priority Score: PS = BSS × R × exposure_factor
```

**Lifecycle:** `EMERGING → ACTIVE → UNDER_REMEDIATION → MONITORING → RESOLVED` (or `RECURRED` if events return post-resolution — surfaced separately as a repeat-failure signal on department scorecards).

**Joint work orders:** one black spot → multiple linked tickets, each with single department ownership (BR-3) but shared `black_spot_id` for context.

## 11. City Pulse Score™ Engine

```
CPS = 0.30×RoadHealth + 0.25×TrafficFlow + 0.25×PublicSafety + 0.20×DeptEfficiency

RoadHealth     = Σ(segment_score × exposure_w) / Σ(exposure_w)
TrafficFlow    = 100 − normalised(congestion_minutes_per_corridor_day)
PublicSafety   = 100 − normalised(Σ incident_severity_weighted × school_zone_multiplier)
DeptEfficiency = 0.50×SLA_compliance% + 0.30×(100−normalised(median_resolution_hrs))
               + 0.20×(100−reopen_rate%)

Example: 84×0.30 + 71×0.25 + 76×0.25 + 80×0.20 = 78 / 100
```

**Route Quality Score™:**
```
RQS = 0.35×RoadCondition + 0.25×TrafficDelay + 0.20×SafetyEvents + 0.20×WaterloggingExposure

Example:  Route 7A — 92/100 (Good)   Route 5C — 43/100 (Poor, recurring waterlogging)
```

**Presentation rules (apply everywhere):** every score exposes its breakdown within one interaction; scores carry a computed-at timestamp and staleness indicator; integers only, no decimals, on user-facing surfaces; direction always labelled.

## 12. Deployment Architecture

Full detail: [`DEVOPS.md`](./DEVOPS.md).

```
Environments:  local → dev → staging → production
Edge:          bus device → MQTT (TLS) → cloud gateway
Platform:      API (n replicas) → Postgres+PostGIS / Redis / Object Store → BullMQ workers
Clients:       Dashboard, Field App, Citizen App, Public Portal
```

## 13. Event Flow (Ingestion Pipeline)

```
1. RECEIVE      MQTT topic nagarnetra/events/<deviceId> or POST /ingest/events
2. AUTHENTICATE device certificate/token; reject unknown devices
3. VALIDATE     schema, payload size, timestamp sanity, clock-skew correction
4. IDEMPOTENCY  reject duplicate eventUuid
5. PERSIST RAW  immutable raw event record
6. RESOLVE      spatial join → ward, zone, road segment; school-zone check
7. DEDUPLICATE  class + location radius + time window → merge or create
8. CLASSIFY     canonical type, severity, access class
9. STORE MEDIA  keyframe to object store; hash evidence packet if incident
10. ENQUEUE     scoring recompute, governance routing, notification fan-out
11. EMIT        socket broadcast to scoped rooms
```

## 14. Data Flow (End-to-End)

```
Camera frame → detection → confirmation → event → ingestion → jurisdiction
resolution → risk/black-spot scoring → governance routing → ticket → SLA
tracking → resolution → citizen verification → public scorecard update
```

## 15. Monorepo Folder Structure

```
nagarnetra/
├── apps/
│   ├── web/                 # Authority dashboard (React + Vite)
│   ├── portal/               # Public transparency portal (React + Vite)
│   ├── mobile/               # React Native (field officer + citizen)
│   ├── api/                  # Express + TypeScript backend
│   └── worker/               # BullMQ background job processors
├── packages/
│   ├── ui/                   # Shared shadcn-based component library
│   ├── types/                 # Shared TypeScript types (API contracts)
│   ├── config/                # Shared eslint/tsconfig/tailwind config
│   └── scoring/               # Shared scoring formula implementations (risk, pulse, route)
├── edge/
│   ├── models/                # Trained model artifacts (ONNX/TensorRT)
│   ├── pipeline/               # Detection/tracking/ANPR/event-generator code
│   └── simulate_fleet.py      # Fleet simulator for demo/dev
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docs/                       # This documentation set
├── docker-compose.yml
└── package.json                # npm/pnpm workspaces root
```

## 16. Infrastructure Diagram Reference

Diagram specifications (what each must show, sourced from which section) are catalogued in `DEVELOPMENT_SOP.md` §Presentation Assets. Required diagrams: System Architecture, Data Flow, Detection Pipeline, Governance Workflow, Urban Risk Index, Black Spot Engine, City Pulse Score, Department Routing, Verification Model, Deployment, Pilot Rollout, Impact Dashboard.
