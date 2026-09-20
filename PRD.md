# Product Requirements Document — NagarNetra

Related: [`README.md`](./README.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 1. Vision

Every public bus already drives past nearly every road in the city, every day. NagarNetra equips that existing fleet with edge AI so it becomes a continuous urban-sensing network — and, critically, connects what it sees to a governance workflow that scores risk, routes work, enforces accountability, and reports back to the public. The product is not a detector; it is a **municipal accountability system powered by a detector.**

**Baseline data justifying the approach** (cited, verifiable):
- 155,622 road accident fatalities in India in 2021, highest since 2014 (NCRB).
- Potholes caused 4,869 accidents and 2,015 deaths in 2018; 3,564 accidents even in 2020 (MoRTH, Rajya Sabha reply, 2021).
- Hit-and-run cases rose from 53,334 (2014) to 67,387 (2022), killing 50,815 people in 2022, 18.1% of all road deaths, with only a 47.9% conviction rate (NCRB/MoRTH).
- Bengaluru topped NCRB's civic-negligence death list for the 4th consecutive year (2023).
- India has ~65,000 organized urban buses against a ~2.86 lakh benchmark requirement — a 70% deficit (CSE–CITIES Forum, 2026).
- MoRTH allocated only 0.13%–0.32% of its budget to road safety, 2019–2026.

## 2. Goals

| ID | Goal | Success Measure |
|---|---|---|
| G-1 | Increase continuous observation coverage of the road network | % of road-km covered at least once/day by the instrumented fleet |
| G-2 | Reduce time from defect occurrence to department awareness | Median hours from first detection to ticket creation |
| G-3 | Make maintenance prioritisation objective | % of closed tickets that were top-quartile risk at assignment time |
| G-4 | Improve evidentiary quality for incidents | % of incident events with a complete, hash-verified evidence packet |
| G-5 | Make department performance measurable and public | SLA compliance % published per department per month |
| G-6 | Minimise bandwidth and storage cost | Avg. payload bytes per event vs. equivalent raw video |

## 3. Stakeholders

| Stakeholder | Primary Need | What NagarNetra Provides |
|---|---|---|
| Municipal Corporation | Know which roads need repair, and in what order | Ranked defect list with severity, recurrence, ward risk scores |
| PWD | Actionable, located, evidence-backed work orders | Auto-routed tickets with images, GPS, SLA timers |
| Traffic Police | Fast, defensible evidence and congestion insight | ANPR evidence packets, hit-and-run alerts, density heatmaps |
| Drainage Department | Early warning of waterlogging locations | Waterlogging events with recurrence history |
| City Commissioner | One defensible view of city performance | City Pulse Score, department scorecards, trend reports |
| Field Engineers | Clear task list, simple field verification | Mobile app: assigned tickets, offline capture, proof-of-fix upload |
| Citizens | Safer routes, visible accountability | Public portal, smart route planner, verification, issue tracking |
| Transport Department | Route-level operating intelligence | Route Quality Score, delay estimation, OD patterns |
| Smart City Command Centre | Integration, not another silo | Open APIs and event feeds consumable by the existing ICCC |

## 4. User Roles

See [`BACKEND.md`](./BACKEND.md) §RBAC for the full permission matrix. Roles: **Super Admin, Commissioner, Municipal Officer, PWD Officer, Traffic Police, Drainage Officer, Field Engineer, Citizen, Viewer.**

## 5. User Stories

### Authority / Command
- As a **Commissioner**, I want a single City Pulse Score so I can report city health without reading a raw dashboard.
- As a **Municipal Officer**, I want a ranked black spot list so I can prioritise budget toward the highest-risk locations first.
- As a **PWD Officer**, I want tickets auto-created with GPS, images, and severity so I don't have to manually triage complaints.
- As a **Traffic Police officer**, I want a tamper-evident evidence packet generated automatically on a hit-and-run detection so investigation starts faster.
- As a **Department Head**, I want SLA compliance visible for my department so I can manage my team against an objective target, not anecdote.

### Field
- As a **Field Engineer**, I want my assigned tickets available offline so connectivity gaps don't block my workday.
- As a **Field Engineer**, I want to upload proof-of-fix photos so a ticket cannot be closed without evidence of resolution.

### Citizen
- As a **citizen**, I want to plan a route that avoids potholes and waterlogging, not just the fastest one.
- As a **citizen**, I want to confirm or reject an AI-detected issue near me so the system reflects ground truth.
- As a **citizen**, I want to see my department's average resolution time so I can hold them accountable.
- As a **citizen**, I want to track the status of an issue I reported from detection to resolution.

## 6. Features & Sub-Features

### 6.1 Edge AI Detection
- Road defect detection (pothole, crack, damage, missing divider, damaged/missing signboard, faded/missing zebra crossing, waterlogging)
- Traffic monitoring (vehicle detection, classification, counting, density, congestion)
- Public safety (pedestrian detection, school-zone risk uplift, rash driving, near-miss, hit-and-run)
- ANPR (plate localisation, OCR, confidence scoring, evidence packaging)

### 6.2 Edge Processing
- On-device inference, offline operation, local durable buffer, multi-frame confirmation, deduplication, GPS/time tagging, keyframe packaging, auto-sync on reconnect, device health telemetry

### 6.3 Urban Intelligence
- Event ingestion & classification, geospatial resolution, **Urban Risk Index**, **Black Spot Intelligence Engine**, trend analysis, **Route Quality Score**, route delay estimation, OD pattern analysis, predictive deterioration forecasting *(future)*

### 6.4 Governance Automation
- Department auto-routing, ticket creation, SLA assignment, escalation rules, resolution tracking, citizen verification, composite confidence scoring

### 6.5 Authority Dashboard
- Dashboard, Alerts, Heatmaps, Black Spots, Road Health, Traffic Analytics, Risk Analytics, Department Performance, **City Pulse Score**, Reports, Users, Settings, Audit Logs — full page specs in `ARCHITECTURE.md` §5.

### 6.6 Mobile Apps
- Field Officer App (assigned tickets, offline capture, navigation, verification)
- Citizen App (city snapshot, route planner, report issue, verify, my reports, alerts)

### 6.7 Public Transparency Portal
- Public Home Dashboard, Smart Route Planner, City Road Health Map, Black Spot Explorer, AI Verification Center, Issue Tracking Portal, Public Transparency Dashboard, Ward Intelligence, Alert Center, Civic Participation Hub

## 7. Functional Requirements

Full requirement tables with IDs (`FR-EDGE-*`, `FR-EPE-*`, `FR-UIP-*`, `FR-GOV-*`) live in [`ARCHITECTURE.md`](./ARCHITECTURE.md) §2 and [`AI_PIPELINES.md`](./AI_PIPELINES.md). Summary of MUST-have requirements for the hackathon build:

| Module | Must-Have |
|---|---|
| Edge Detection | Potholes, cracks, waterlogging, vehicle detection/classification/counting, pedestrian detection, school-zone risk, hit-and-run detection, ANPR with confidence score |
| Edge Processing | On-device inference, offline operation, local buffer, multi-frame confirmation, dedup, GPS/time tagging, auto-sync |
| Urban Intelligence | Event ingestion & classification, jurisdiction resolution, Urban Risk Index, Black Spot detection, Route Quality Score |
| Governance | Auto-routing, ticket creation, SLA assignment, state transition audit, auto-escalation, citizen + engineer verification signals |
| Dashboard | All 13 pages functional with live data, RBAC-scoped |
| Public Portal | Home dashboard, route planner, road health map, black spot explorer, verification center, issue tracking |

## 8. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-PERF-01 | Performance | Edge inference ≥10 fps sustained on target hardware |
| NFR-PERF-02 | Performance | Dashboard page load < 2s on broadband; map interactions < 100ms perceived latency |
| NFR-REL-01 | Reliability | Edge unit operates fully offline for ≥8 hours with no event loss within buffer capacity |
| NFR-REL-02 | Reliability | RPO 15 minutes, RTO 4 hours for platform data |
| NFR-SEC-01 | Security | TLS 1.3 on all transport; encryption at rest for DB and object store |
| NFR-SEC-02 | Security | Restricted-class data (ANPR, incident evidence) never reachable from any public/unauthenticated endpoint under any parameter combination |
| NFR-SCALE-01 | Scalability | Architecture supports horizontal scaling of API and worker tiers independently |
| NFR-BAND-01 | Bandwidth | Only structured events + compressed keyframes transmitted; no raw video leaves the edge device |
| NFR-ACC-01 | Accessibility | WCAG 2.1 AA contrast minimums in both themes; full keyboard operability |
| NFR-A11Y-02 | Accessibility | prefers-reduced-motion respected across all animated UI |
| NFR-OBS-01 | Observability | Structured logs with correlation IDs; ingestion lag, queue depth, and SLA breach rate alertable |

## 9. Business Rules

| ID | Rule |
|---|---|
| BR-1 | An event is never published publicly until it passes multi-frame confirmation and deduplication. |
| BR-2 | ANPR data, plate numbers, and incident evidence are visible only to Traffic Police and Super Admin; never exposed via any public endpoint. |
| BR-3 | Every ticket has exactly one owning department; multi-department black spots use linked tickets, not shared ownership. |
| BR-4 | SLA timers start at ticket creation, not detection, and pause only in an explicit hold state with a recorded reason. |
| BR-5 | A ticket may only be closed with a resolution artifact attached. |
| BR-6 | Citizen verification adjusts confidence but never creates or closes a ticket by itself. |
| BR-7 | Risk scores are recomputed on schedule and stored with their parameter version for reproducibility. |
| BR-8 | Raw video never leaves the edge device — only structured events and keyframes. |

## 10. Public Portal Requirements

Full page-by-page specification in [`ARCHITECTURE.md`](./ARCHITECTURE.md) §6. Key requirements:
- Public read access requires no login; personalisation (saved routes, subscriptions, voting) requires citizen sign-in.
- Restricted-class events (hit-and-run, rash driving, near-miss detail) are never rendered on any public surface — enforced at the API layer, not just hidden in the UI.
- Route planner must present at least 4 ranked options (fastest, safest, best road quality, lowest congestion) with a plain-language rationale, and must state clearly that suggestions are advisory, not a safety guarantee.
- Department scorecards must show SLA compliance %, average resolution time, open/resolved counts, and citizen rating.
- AI Verification Center confidence composition: AI confidence → + citizen verification → + engineer verification → final confidence (formula in `ARCHITECTURE.md` §11.5).

## 11. Mobile App Requirements

| App | Must-Have |
|---|---|
| Field Officer App | Offline-capable for ≥12 hours; assigned-ticket list with SLA urgency; camera capture with auto GPS/timestamp stamping; queued writes with idempotency keys; server-authoritative conflict resolution |
| Citizen App | City/ward snapshot; route planner; report-issue flow with photo + auto-location; verification queue; my-reports tracker; alert subscriptions (push/WhatsApp/SMS/email) |

## 12. Success Metrics

| Metric | Target / Direction |
|---|---|
| Road-km coverage per day | Increase toward 80–90% of major arterial/sub-arterial roads *(illustrative target for a 1,000-bus fleet)* |
| Detection-to-ticket latency | Minutes, not days-to-weeks |
| Bandwidth per event vs. raw video | ~90–95% reduction *(illustrative)* |
| SLA compliance | Increasing trend per department, published monthly |
| Black spot recurrence rate | Decreasing trend post-remediation |
| Citizen verification participation | Increasing monthly active verifiers |
| False positive rate (ticket-generating classes) | ≤ 0.5 confirmed FP per km |

## 13. Future Scope

- Predictive route planner using forecast rather than only observed conditions.
- Road deterioration forecasting and flood prediction layer.
- Accident risk prediction at segment level.
- Safe school route finder; emergency vehicle route optimisation.
- Federated cross-city model improvement without centralising raw imagery.
- Multi-tenant, multi-city deployment with per-city configuration and ICCC integration APIs.
- BEL-manufacturable, ruggedised, indigenous edge hardware module (Make in India positioning).
