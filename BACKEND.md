# Backend + Database Guide — NagarNetra

Related: [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`AI_PIPELINES.md`](./AI_PIPELINES.md) (event schema origin) · [`DEVOPS.md`](./DEVOPS.md)

---

## 1. Express Architecture

**Stack:** Node.js + TypeScript, Express.js, Prisma ORM, PostgreSQL + PostGIS, Redis, BullMQ, Socket.IO, MQTT broker (Mosquitto/EMQX), JWT + RBAC middleware, S3-compatible object storage.

```
src/
├── server.ts                    # bootstrap, graceful shutdown
├── config/                      # env schema, constants, feature flags
├── routes/                      # express routers by domain
├── controllers/
├── services/
│   ├── ingestion/               # event validation, dedup, spatial resolution
│   ├── governance/               # routing, ticketing, SLA, escalation
│   ├── scoring/                  # risk index, city pulse, route quality
│   ├── blackspot/                # clustering and ranking
│   ├── analytics/                # trends, OD, delay estimation
│   ├── evidence/                 # packet assembly, hashing, chain of custody
│   ├── notification/             # push, SMS, WhatsApp, email dispatch
│   └── reporting/                # template rendering and export
├── repositories/
├── jobs/                         # BullMQ processors and schedules
├── realtime/                     # socket namespaces, rooms, emitters
├── mqtt/                         # broker client, topic handlers
├── middleware/                   # auth, rbac, validation, rate limit, audit
├── lib/                          # prisma client, redis, s3, geo utilities
└── types/
```

## 2. Service Layer

Business rules and orchestration live here, never in controllers or repositories. Each service is transactional where it spans multiple tables (e.g. ticket creation + SLA assignment + notification enqueue happens in one Prisma transaction). Services never construct raw SQL for anything expressible in Prisma; raw/spatial SQL is isolated to the repository layer.

## 3. Controller Layer

Responsibilities: bind and validate the request (Zod), enforce auth + RBAC + jurisdiction scope, call exactly one service method, shape the response envelope. Controllers contain no business logic and no direct Prisma calls.

## 4. Repository Layer

All Prisma queries and PostGIS spatial queries live here. No business logic. This is the layer where jurisdiction scoping and access-class filtering are enforced as **mandatory query predicates** — not optional filters applied later — so a scoping bug cannot leak restricted rows.

```
Layered request flow:
HTTP/MQTT/WS → ROUTE (schema validation) → CONTROLLER (auth, RBAC, scope)
  → SERVICE (business rules, transactions) → REPOSITORY (Prisma/spatial queries)
  → DATABASE / CACHE / OBJECT STORE
```

## 5. API Design

**Conventions:**

| Aspect | Standard |
|---|---|
| Base path | `/api/v1` — versioned in path, never broken in place |
| Auth | `Authorization: Bearer <access_token>`; refresh via `POST /auth/refresh` |
| Pagination | Cursor-based: `?limit=50&cursor=<opaque>`, response includes `nextCursor` |
| Idempotency | `Idempotency-Key` header required on all state-creating POSTs |
| Rate limiting | Per-token and per-IP; `429` with `Retry-After` |
| Errors | RFC 7807 `problem+json` |

**Response envelope:**
```json
// Success (collection)
{ "data": [ { } ], "meta": { "count": 50, "nextCursor": "eyJpZCI6MTIzfQ", "scope": {"wardId": 12} } }

// Error
{
  "type": "https://nagarnetra.gov.in/errors/sla-transition-invalid",
  "title": "Invalid ticket transition", "status": 409,
  "detail": "Cannot transition from RESOLVED to ACKNOWLEDGED",
  "instance": "/api/v1/tickets/4512/transition", "traceId": "01HQ7X9K2M"
}
```

**Endpoint catalogue (representative — full list mirrors `ARCHITECTURE.md` module scope):**

| Domain | Key Endpoints |
|---|---|
| Auth | `POST /auth/login`, `/auth/refresh`, `/auth/citizen/register`, `/auth/otp/request` |
| Ingestion | `POST /ingest/events`, `POST /ingest/heartbeat` |
| Events | `GET /events`, `/events/:id`, `/events/area`, `PATCH /events/:id/status` |
| Tickets | `GET /tickets`, `POST /tickets`, `POST /tickets/:id/transition`, `POST /tickets/:id/proof` |
| Scoring | `GET /scores/risk/wards`, `/scores/city-pulse`, `/scores/routes`, `PUT /scores/risk/parameters` |
| Black Spots | `GET /blackspots`, `/blackspots/:id`, `POST /blackspots/:id/work-order` |
| Maps | `GET /maps/wards`, `/maps/heatmap`, `/maps/live-positions` |
| Departments | `GET /departments/performance`, `/departments/:id/metrics` |
| Reports | `GET /reports/templates`, `POST /reports/generate`, `GET /reports/:id/download` |
| Admin | `GET/POST /users`, `GET/PUT /settings/:key`, `GET /audit-logs` |
| Road Crimes | `GET /road-crimes/cases`, `/road-crimes/cases/:id`, `PATCH /road-crimes/cases/:id/status`, `GET /road-crimes/cases/:id/evidence-certificate`, `GET /road-crimes/repeat-offenders`, `GET /road-crimes/hotspots` |
| Public | `GET /public/summary`, `/public/scores`, `/public/events`, `POST /public/routes/plan`, `POST /public/verification/:eventId/vote` |

**Representative contract — ticket transition:**
```
POST /api/v1/tickets/4512/transition
Idempotency-Key: 9f1c2e3a-...

REQUEST
{ "toState": "RESOLVED", "reason": "Pothole filled and surface levelled",
  "proofMediaKeys": ["evidence/2026/09/4512-fix-01.jpg"] }

VALIDATION
  · toState must be reachable from current state
  · actor role must be permitted for this transition
  · RESOLVED requires ≥1 proofMediaKey (BR-5)
  · ON_HOLD requires a non-empty reason (BR-4)

RESPONSE 200
{ "data": { "id": 4512, "ticketRef": "NN-2026-004512", "state": "RESOLVED",
  "resolvedAt": "2026-09-19T11:24:07Z", "slaMet": true, "escalationLevel": 0 } }

ERRORS  403 role not permitted · 409 invalid transition
        422 missing proof of fix · 429 rate limited
```

> **Rule:** every `/public/*` endpoint applies its access-class filter at the repository layer. It is not sufficient to filter in the controller — the restriction must be impossible to bypass through any query parameter combination.

## 6. Event Schema

```json
{
  "eventUuid": "uuid",
  "deviceId": "bus-device-id",
  "eventType": "pothole | crack | waterlogging | vehicle_density | pedestrian_risk | hit_and_run | ...",
  "severity": "low | medium | high | critical",
  "accessClass": "public | restricted",
  "aiConfidence": 84.0,
  "finalConfidence": 84.0,
  "location": { "lat": 12.97, "lng": 77.59 },
  "heading": 214.5,
  "firstObservedAt": "ISO-8601 UTC",
  "lastObservedAt": "ISO-8601 UTC",
  "observationCount": 1,
  "mediaKey": "object-store-key",
  "anpr": { "plateText": "KA01AB1234", "plateConfidence": 91.2 },
  "status": "detected | verified | duplicate | rejected | ticketed"
}
```

## 7. PostgreSQL Schema (core tables)

**`events`**

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| event_uuid | UUID UNIQUE NOT NULL | idempotency key |
| device_id | BIGINT FK bus_devices | |
| event_type | event_type_enum | canonical taxonomy |
| severity | severity_enum | low/medium/high/critical |
| access_class | access_enum | public/restricted |
| ai_confidence, final_confidence | NUMERIC(5,2) | 0–100 |
| location | GEOGRAPHY(POINT,4326) | GIST-indexed |
| ward_id, zone_id, road_segment_id | BIGINT FK, nullable | null until spatial resolution |
| observation_count | INT DEFAULT 1 | incremented on dedup |
| first_observed_at, last_observed_at | TIMESTAMPTZ | |
| media_key | TEXT | keyframe object key |
| status | event_status_enum | |

Indexes: GIST(location); BTREE(ward_id, event_type, last_observed_at); UNIQUE(event_uuid); partial index WHERE status='detected'.

**`tickets`**

| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| ticket_ref | TEXT UNIQUE | e.g. `NN-2026-004512` |
| event_id | BIGINT FK events | |
| black_spot_id, parent_ticket_id | BIGINT FK, nullable | joint work orders |
| department_id | BIGINT FK NOT NULL | single owning department (BR-3) |
| state | ticket_state_enum | see state machine below |
| priority | severity_enum | drives SLA selection |
| sla_response_due_at, sla_resolution_due_at | TIMESTAMPTZ | frozen at creation (BR-4) |
| escalation_level | INT DEFAULT 0 | |
| resolution_media_key | TEXT nullable | required for closure (BR-5) |
| hold_reason | TEXT nullable | required when state=ON_HOLD |

Indexes: BTREE(department_id, state, sla_resolution_due_at); BTREE(ward_id, state); partial index WHERE state NOT IN ('CLOSED','REJECTED').

**`cases` (Road Crime Law-Enforcement Workflow)**
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL PK | |
| case_number | TEXT UNIQUE | e.g. "RC-2026-0917-0042" |
| incident_event_id | BIGINT FK incident_events | |
| status | case_status_enum | NEW, UNDER_REVIEW, SUSPECT_TRACED, ACTION_TAKEN, CLOSED, REJECTED |
| assigned_officer_id | BIGINT FK | |
| repeat_offender_flag| BOOLEAN | |
| linked_case_ids | UUID[] | |
| rejection_reason | TEXT | |

**Supporting tables:** `users, roles, permissions, role_permissions, user_roles, departments, alerts, sla_rules, ticket_transitions, risk_scores, black_spots, black_spot_events, route_scores, city_scores, citizen_reports, citizen_verifications, incident_events, anpr_records, evidence_packets, cases, case_activity_log, evidence_access_log, vehicles, bus_devices, routes, wards, zones, road_segments, notifications, audit_logs`.

**Integrity rules:**
- All geometry columns SRID 4326 with GIST indexes; geography type for metre-accurate distance without manual projection.
- `events`, `ticket_transitions`, `evidence_packets`, `audit_logs` are append-only — corrections are new rows, never updates.
- Foreign keys `ON DELETE RESTRICT` for referential entities, `CASCADE` only for pure join tables.
- All timestamps `TIMESTAMPTZ` in UTC; IST conversion happens client-side.
- JSONB breakdown columns (`risk_scores.factor_breakdown`, `city_scores.components`) store full factor decomposition alongside every computed score, so historical explanations remain reproducible after weight changes.

## 8. Prisma Models

```prisma
model Event {
  id               BigInt   @id @default(autoincrement())
  eventUuid        String   @unique
  deviceId         BigInt
  eventType        EventType
  severity         Severity
  accessClass      AccessClass
  aiConfidence     Decimal  @db.Decimal(5,2)
  finalConfidence  Decimal  @db.Decimal(5,2)
  location         Unsupported("geography(Point,4326)")
  wardId           BigInt?
  zoneId           BigInt?
  roadSegmentId    BigInt?
  observationCount Int      @default(1)
  firstObservedAt  DateTime
  lastObservedAt   DateTime
  mediaKey         String?
  status           EventStatus
  tickets          Ticket[]
  createdAt        DateTime @default(now())

  @@index([wardId, eventType, lastObservedAt])
}

model Ticket {
  id                    BigInt      @id @default(autoincrement())
  ticketRef             String      @unique
  eventId               BigInt
  event                 Event       @relation(fields: [eventId], references: [id])
  blackSpotId           BigInt?
  parentTicketId        BigInt?
  departmentId          BigInt
  wardId                BigInt
  state                 TicketState
  priority              Severity
  slaResponseDueAt      DateTime
  slaResolutionDueAt    DateTime
  escalationLevel       Int         @default(0)
  resolutionMediaKey    String?
  holdReason            String?
  transitions           TicketTransition[]
  createdAt             DateTime    @default(now())

  @@index([departmentId, state, slaResolutionDueAt])
}

model TicketTransition {
  id         BigInt   @id @default(autoincrement())
  ticketId   BigInt
  ticket     Ticket   @relation(fields: [ticketId], references: [id])
  fromState  TicketState
  toState    TicketState
  actorId    BigInt
  reason     String?
  createdAt  DateTime @default(now())
}
```

*(Full model set — `RiskScore`, `BlackSpot`, `CityScore`, `RouteScore`, `EvidencePacket`, `AnprRecord`, etc. — mirrors the PostgreSQL schema in §7 one-to-one; generate via `prisma db pull` against the canonical migration set.)*

## 9. Redis Strategy

| Use | Pattern |
|---|---|
| Hot aggregates | Cache computed heatmap grids, KPI summaries, keyed by scope (`heatmap:ward:12:pothole`) |
| Rate limiting | Sliding-window counters per token/IP |
| Socket fan-out | Pub/sub backing Socket.IO adapter across API replicas |
| Job coordination | BullMQ queues and job state |
| Session/refresh tracking | Refresh-token reuse detection |

## 10. Socket.IO Events

**Namespaces & rooms:** `/ops` → `ward:<id>`, `dept:<id>`, `city`, `restricted`; `/fleet` → `fleet`; `/public` → `public`.

**Server → client events:** `event:created`, `event:updated`, `ticket:created`, `ticket:updated`, `ticket:escalated`, `alert:critical`, `bus:position` (throttled to 1Hz/device), `score:recomputed`, `blackspot:detected`.

**Client → server events:** `subscribe`, `unsubscribe`, `resync` (delta since sequence number), `ack`.

**Rules:** room membership authorised server-side at subscribe time against token roles/scope — a client cannot join a room by naming it. Every emission carries a monotonic sequence number per room for gap detection. Critical alerts are additionally persisted and delivered via the notification service, so socket failure never means a missed alert.

## 11. Notifications

Channels: in-app, push, SMS, WhatsApp, email. Dispatch via `notification:dispatch` BullMQ job. Every ticket state change and SLA escalation enqueues a notification per subscriber preference. Delivery status logged in `notifications` table for audit.

## 12. Authentication

- JWT access tokens (15 min) + rotating refresh tokens (7 days); refresh-reuse detection triggers full session revocation.
- Edge devices authenticate with per-device credentials, not shared secrets — a compromised device is revocable individually.
- Citizen accounts: phone-based OTP. Authority accounts: credentials + mandatory MFA for Super Admin and Commissioner.
- All sessions enumerable and revocable; revocation takes effect at next token refresh, immediately for sockets.

## 13. RBAC

**Roles:** Super Admin, Commissioner, Municipal Officer, PWD Officer, Traffic Police, Drainage Officer, Field Engineer, Citizen, Viewer.

**Permission matrix** (F=full, R=read, O=own records, D=department-scoped, A=aggregate only, —=none):

| Capability | Super Admin | Commissioner | Municipal Officer | PWD/Drainage | Traffic Police | Field Engineer | Citizen | Viewer |
|---|---|---|---|---|---|---|---|---|
| View public events | F | F | F | D | F | O | R | R |
| View restricted events | F | R | — | — | F | — | — | — |
| Access evidence packets | F | R | — | — | F | — | — | — |
| Create ticket | F | — | F | D | F | — | — | — |
| Transition ticket | F | — | F | D | D | O | — | — |
| Close ticket | F | F | F | D | D | — | — | — |
| Citizen verification | F | — | — | — | — | — | F | — |
| Configure risk weights | F | — | — | — | — | — | — | — |
| Manage users | F | — | D | — | — | — | — | — |
| View audit logs | F | F | D | — | — | — | — | — |

**Enforcement rule:** permission checks are server-side and mandatory. Client-side hiding of a control is a usability measure, never a security control — every restricted-data endpoint independently re-verifies role and jurisdiction scope on each request.

**Ticket state machine:**
```
DETECTED → VERIFIED → ASSIGNED → ACKNOWLEDGED → IN_PROGRESS → RESOLVED → CLOSED
   │           │                      │                │              │
   │           └→ REJECTED            └→ ON_HOLD ←──────┘              │
   │                (false positive)       │                          │
   └→ DUPLICATE (merged into parent)       └→ back to IN_PROGRESS     └→ REOPENED

ESCALATED is a flag settable on any state between ASSIGNED and RESOLVED on SLA breach.
```

**Case State Machine (Road Crimes Workflow):**
```
        ┌─────────┐
        │   NEW    │  ← auto-created the instant evidence packet is verified
        └────┬─────┘
             │ officer opens the case
        ┌────▼─────────┐
        │ UNDER_REVIEW  │
        └────┬──────────┘
             │
     ┌───────┼────────────────┐
     │                         │
┌────▼─────────┐      ┌────────▼────────┐
│ REJECTED      │      │ SUSPECT_TRACED  │
│ (false        │      └────────┬────────┘
│  positive)    │               │
└───────────────┘      ┌────────▼────────┐
                        │  ACTION_TAKEN   │  (challan issued / FIR filed / notice sent)
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │     CLOSED       │
                        └─────────────────┘
```

**SLA matrix:**

| Severity | Response | Resolution | Escalation Path |
|---|---|---|---|
| Critical | 1 hour | 24 hours | Officer → Head → Commissioner |
| High | 4 hours | 72 hours | Officer → Head |
| Medium | 24 hours | 7 days | Officer → Head |
| Low | 72 hours | 30 days | Officer |

**Department routing matrix:** see `ARCHITECTURE.md` §9 for factor context; routing table: pothole/crack/damage/divider → PWD/Municipal Corporation; signboard → Traffic Police + PWD; waterlogging → Drainage; congestion → Traffic Planning; pedestrian/school-zone/near-miss/rash-driving/hit-and-run → Traffic Police (last three are `restricted` access class).

## 14. Audit Logs

Immutable, append-only record of: auth events, ticket state transitions, evidence packet access, settings changes, user/role changes, report generation, data exports, public-visibility overrides. Every entry: actor, action, entity type/id, before/after JSONB, IP, timestamp. Retention: 7 years, never purged within window.

## 15. Background Jobs (BullMQ)

| Job | Schedule | Purpose |
|---|---|---|
| `risk:recompute` | Every 15 min | Recalculate Urban Risk Index per ward/zone |
| `blackspot:cluster` | Hourly | Re-run spatial clustering, update registry |
| `citypulse:recompute` | Hourly | Recalculate City Pulse Score + components |
| `route:score` | Every 30 min | Recalculate Route Quality Score |
| `sla:check` | Every 5 min | Detect SLA breaches, trigger escalation |
| `notification:dispatch` | On demand | Deliver queued notifications |
| `report:generate` | On demand + monthly | Render/store report artifacts |
| `device:health` | Every 10 min | Flag devices with stale heartbeat/degraded inference |
| `retention:enforce` | Daily | Apply data retention policy |
