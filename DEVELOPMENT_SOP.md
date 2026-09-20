# Development SOP — NagarNetra

Related: all other documents. This file governs *how the team works*; the others govern *what gets built*.

---

## 1. Project Phases

| Phase | Theme | Deliverables | Exit Criteria |
|---|---|---|---|
| Phase 1 | Core Detection | Edge detection (potholes, damage, waterlogging, vehicles), ingestion pipeline, event storage, basic map | Events flow end-to-end from device to map with confirmed accuracy on the frozen test set |
| Phase 2 | Urban Intelligence | Urban Risk Index, Black Spot Engine, Road Health scoring, Route Quality Score, analytics pages | All scoring engines produce reproducible, decomposable scores with stored breakdowns |
| Phase 3 | Governance Automation | Routing matrix, ticketing, SLA engine, escalation, department dashboards, field officer app | A detection produces a routed, tracked ticket that escalates correctly on breach |
| Phase 4 | Public and Predictive | Public portal, citizen verification, smart route planner, deterioration forecasting | Citizens can verify detections and plan routes; forecasts are labelled and validated |
| Phase 5 | Multi-City Expansion | Multi-tenancy, per-city config, ICCC integration APIs, federated model improvement | A second city onboards without code changes |

## 2. Sprint Plan (indicative, 2-week sprints for a hackathon-to-pilot timeline)

| Sprint | Focus |
|---|---|
| 1–2 | Repo scaffold, design system tokens, DB schema, edge simulator, auth + RBAC skeleton |
| 3–4 | Edge detection models (defect + vehicle), ingestion pipeline, event storage, basic dashboard shell |
| 5–6 | Urban Risk Index + Black Spot Engine, Risk Analytics + Black Spots pages, GIS heatmaps |
| 7–8 | Governance engine (routing, ticketing, SLA, escalation), Department Performance page, field officer app |
| 9–10 | City Pulse Score, Route Quality Score, Reports, Audit Logs, remaining dashboard pages |
| 11–12 | Public portal (home, route planner, road health map, black spot explorer) |
| 13–14 | AI Verification Center, Civic Participation Hub, citizen app, notification channels |
| 15–16 | Hardening: security review, load testing, accessibility pass, both-theme QA, pilot readiness |

## 3. Roadmap

See `PRD.md` §13 Future Scope for post-pilot roadmap items (predictive forecasting, federated learning, multi-city, indigenous hardware).

## 4. Git Workflow

```
main        production-ready, tagged releases only, protected
develop     integration branch, always deployable to dev
feature/*   feature/NN-142-blackspot-clustering
fix/*       fix/NN-201-sla-timer-pause
release/*   release/1.2.0  — stabilisation only, no new features
hotfix/*    hotfix/1.1.1-evidence-hash  — branches from main

feature → develop → release → main → tag
hotfix  → main + back-merge to develop
```

## 5. Branching Strategy

- `main` and `develop` are protected: no direct pushes, PR + review required.
- Feature branches are short-lived (target < 1 week); rebase on `develop` before opening a PR to keep history linear.
- `release/*` branches accept only fixes discovered during stabilisation, never new scope.
- `hotfix/*` branches from `main` for production incidents, merged back to both `main` and `develop`.

## 6. Commit Convention

```
<type>(<scope>): <subject>          [NN-<issue>]

types:  feat · fix · refactor · perf · docs · test · chore · ci
scopes: edge · ingest · governance · scoring · blackspot · api
        web · portal · mobile · db · infra

examples:
  feat(scoring): add recency decay to urban risk index   [NN-142]
  fix(governance): freeze SLA target at creation         [NN-201]
  docs(api): document ticket transition error codes      [NN-233]
```

## 7. Pull Requests

Every PR must include:
- Linked issue with requirement ID(s) from `PRD.md` (`FR-*`, `NFR-*`) where applicable.
- Description of the change and explicit note of any documentation section it invalidates.
- Screenshots or a short recording for any user-facing change, **in both light and dark theme**.
- Migration files reviewed separately and confirmed reversible, if the PR touches schema.
- At least one approving review; **two approvals required** for changes to scoring formulas, the governance engine, RBAC, or the database schema.

## 8. Code Review Rules

| Area | Checks |
|---|---|
| Correctness | Business rules (`PRD.md` §9) upheld; state transitions validated server-side |
| Security | Authorisation asserted at the repository layer; no restricted data reachable from public endpoints |
| Data | Migrations reversible; indexes present for new query patterns; append-only tables not mutated |
| Performance | No spatial joins added to read paths; no N+1 queries; pagination on all collections |
| Frontend | Loading/empty/error states present; both themes verified; keyboard accessible |
| Documentation | The relevant `.md` file updated in the same PR where behaviour changed |

## 9. Testing Strategy

| Layer | Approach |
|---|---|
| Unit | Service logic, scoring formula implementations (risk index, black spot score, city pulse, route quality) — these carry the highest coverage requirement given they drive governance decisions |
| Integration | API endpoints against ephemeral Postgres+PostGIS and Redis; RBAC negative tests (confirm restricted data is unreachable from public/under-scoped requests) |
| E2E | Critical governance loop: detection → ticket creation → SLA timer → escalation → resolution → citizen verification, run against a seeded scenario |
| Edge/AI | Slice-based evaluation per `AI_PIPELINES.md` §8 on every model release, not just aggregate accuracy |
| Frontend | Component tests for `ScoreGauge`, `StatusBadge`, `ConfidenceBar`; visual regression on both themes for key pages |
| Load | Ingestion pipeline load-tested at expected fleet-wide event rate before any pilot fleet expansion |

## 10. QA Checklist (pre-release)

- [ ] All acceptance criteria in `PRD.md`/`ARCHITECTURE.md` requirement tables verified for in-scope IDs.
- [ ] RBAC matrix (`BACKEND.md` §13) spot-checked per role with a real login, not just unit tests.
- [ ] Both themes checked on every touched screen, including map tiles, charts, and toasts.
- [ ] No console errors/warnings on load or during normal navigation.
- [ ] Restricted-class data confirmed unreachable from the public portal and citizen app via manual API probing, not just code review.
- [ ] SLA escalation verified end-to-end with a time-shifted test ticket.
- [ ] Illustrative/demo data clearly labelled wherever shown; no synthetic figure presented as measured.

## 11. Release Process

1. Cut `release/x.y.z` from `develop`.
2. Stabilisation: fixes only, each still going through PR + review.
3. Deploy to `staging`; run the full QA checklist above.
4. Tag `main` on approval; deploy to `production` requires explicit engineering-lead sign-off (per `DEVOPS.md` §3 CI/CD gate).
5. Back-merge `release/x.y.z` into `develop`.
6. Publish release notes referencing closed requirement IDs.

## 12. Team Responsibilities

| Role | Owns | Primary Docs |
|---|---|---|
| AI / CV Engineer | Detection models, training pipeline, edge optimisation, sensor fusion | `AI_PIPELINES.md` |
| Backend Engineer | Ingestion, governance engine, scoring services, API | `BACKEND.md`, `ARCHITECTURE.md` §9–11 |
| Data / GIS Engineer | Spatial model, clustering, analytics, database design | `ARCHITECTURE.md` §7, `BACKEND.md` §7–8 |
| Frontend Engineer | Authority dashboard, public portal, design system implementation | `FRONTEND.md`, `DESIGN_SYSTEM.md` |
| Mobile Engineer | Field officer and citizen applications, offline sync | `FRONTEND.md` §14 |
| DevOps / Security | Deployment, observability, security controls, evidence integrity | `DEVOPS.md`, `ARCHITECTURE.md` §8 |
| Product / Presentation Lead | Requirements traceability, documentation currency, SIH materials | `PRD.md`, this file §15 |

Role names describe ownership, not headcount — on a small team one person may hold several roles, but every document above has exactly one named owner accountable for its currency.

## 13. Risk Management

| Risk | Mitigation |
|---|---|
| Vision model fails in low light/rain | Sensor-fusion IMU fallback (`AI_PIPELINES.md` §16); slice-based evaluation catches this before release |
| False positives cause alert fatigue | Multi-frame confirmation + dedup + confidence gating before any ticket is created |
| Department adoption resistance | Advisory mode fallback, SMS/WhatsApp channels, phased rollout (`PRD.md` §9 constraints) |
| Restricted data leak via public endpoint | Access-class filtering enforced at the repository layer, verified by negative RBAC tests, not just code review |
| Scoring formula drift undermines trust | Weights are configuration with mandatory audit trail; every score stores its `parameter_version` and full breakdown |
| Documentation drift from implementation | Doc updates required in the same PR (§7); doc currency is a named responsibility (§12) |
| Overclaiming legal/technical status | Evidence packets are framed as "tamper-evident," never "court-admissible"; illustrative figures always labelled |

## 14. Documentation Standards

- Documentation drift is treated as a defect, not a backlog item — a merged PR that changes behaviour without updating the matching `.md` file is a review failure.
- Every requirement, business rule, and formula referenced in code must be traceable to an ID or section in `PRD.md` or `ARCHITECTURE.md`.
- Change triggers and required updates:

| Trigger | Required Update |
|---|---|
| Scoring formula or weight change | `ARCHITECTURE.md` §9–11, including worked examples |
| New event type | `PRD.md` §7, `BACKEND.md` §13 routing matrix, event schema enum |
| SLA policy change | `BACKEND.md` §13 SLA matrix |
| New role or permission | `BACKEND.md` §13 permission matrix |
| Schema change | `BACKEND.md` §7–8, with the migration referenced in the PR |
| New API endpoint | `BACKEND.md` §5 endpoint catalogue |
| Pilot measurements available | Replace every illustrative figure across all docs; update `PRD.md` §1 and §12 |

## 15. Presentation Assets (SIH Deliverables)

| Diagram | Must Show | Source |
|---|---|---|
| System Architecture | Edge device, gateway, API, data stores, workers, clients, protocols labelled | `ARCHITECTURE.md` §1 |
| Data Flow | Frame → detection → confirmation → event → ingestion → resolution → scoring → ticket → dashboard → citizen | `ARCHITECTURE.md` §14 |
| Detection Pipeline | Camera through YOLOv11, tracker, class router, ANPR branch | `AI_PIPELINES.md` §1 |
| Governance Workflow | Detect → ward → department → ticket → SLA → resolution → escalation, state machine inset | `BACKEND.md` §13 |
| Urban Risk Index | Six factors → normalisation → weighting → composite, with worked example | `ARCHITECTURE.md` §9 |
| Black Spot Engine | Scattered events clustering into a ranked spot with factor profile | `ARCHITECTURE.md` §10 |
| City Pulse Score | Four components with weights converging on a single gauge | `ARCHITECTURE.md` §11 |
| Verification Model | AI + citizen + engineer signals composing into final confidence | `ARCHITECTURE.md` §9 |
| Deployment | Environments, CI/CD stages, promotion gates | `DEVOPS.md` §5, §3 |
| Pilot Rollout | Phase 1 fleet size, coverage expansion, milestone sequence | Phases §1 above |

**Presentation discipline:**
- Every figure shown to judges must be traceable to a section of these documents — a number with no source does not get presented.
- Cited national statistics and platform projections must be visually distinguished on any slide: statistics carry their source, projections carry the label "projected"/"illustrative."
- Demonstrate the full governance loop (detect → route → SLA → escalate → resolve → verify) rather than detection accuracy alone — that loop is the differentiator, not the detector.
