# Frontend Development Guide — NagarNetra

Related: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) · [`ARCHITECTURE.md`](./ARCHITECTURE.md) · [`BACKEND.md`](./BACKEND.md) (API contracts)

---

## 1. React Architecture

- **React 18 + TypeScript**, functional components and hooks only.
- **Vite** build tool for all three web apps (`apps/web`, `apps/portal`) and shared dev tooling.
- **Tailwind CSS + shadcn/ui** as the component foundation — re-themed to the tokens in `DESIGN_SYSTEM.md`, never left default.
- **Redux Toolkit + RTK Query** for global/shared state and server-cache management.
- **React Hook Form + Zod** for forms, sharing schemas with API contract types.
- **Framer Motion** for all animation.
- **Leaflet + react-leaflet** (primary, no API key needed) with Mapbox GL as an optional production upgrade.
- **Recharts** for all charts, themed per `DESIGN_SYSTEM.md` §10.
- **TanStack Table** for all data tables (virtualised above 200 rows).
- **React Router v6** for routing.
- **Socket.IO client** for realtime.

## 2. Folder Structure

```
apps/web/src/                       # same pattern applies to apps/portal
├── app/
│   ├── store.ts                 # Redux store configuration
│   ├── router.tsx               # Route tree, lazy boundaries
│   └── providers.tsx            # Theme, query, socket, error boundary providers
├── features/                    # Domain-oriented vertical slices
│   ├── auth/                    # slice, api, components, hooks, types
│   ├── dashboard/
│   ├── alerts/
│   ├── events/
│   ├── tickets/
│   ├── blackspots/
│   ├── roadHealth/
│   ├── traffic/
│   ├── risk/
│   ├── departments/
│   ├── cityPulse/
│   ├── reports/
│   ├── users/
│   ├── settings/
│   └── audit/
├── components/
│   ├── ui/                      # shadcn primitives (generated)
│   ├── charts/                  # themed chart wrappers
│   ├── map/                     # map shell, layers, legends, markers
│   ├── data/                    # DataTable, KpiCard, ScoreGauge, StatusBadge, ConfidenceBar
│   └── layout/                  # AppShell, NavRail, CommandBar, PageHeader
├── hooks/                       # useSocket, useScope, useDebounce, usePermissions
├── lib/                         # api client, socket client, formatters, cn()
├── types/                       # shared domain types mirroring API contracts
├── constants/                   # enums, colour maps, SLA config, layer registry
└── styles/                      # tailwind entry, theme tokens
```

**Conventions:**
- Feature-first: each feature owns its slice, RTK Query endpoints, components, hooks, types. Cross-feature imports go through a feature's public `index.ts`, never into internals.
- `components/` is domain-agnostic and must never import from `features/`.
- Every page component is lazy-loaded at the route boundary with a matching skeleton fallback.
- Permission gating goes through a `usePermissions()` hook + `<Can>` wrapper — no page implements its own inline role check.
- API response shapes live in `types/`, reused by both RTK Query endpoints and Zod schemas — a contract change fails the build, not just runtime.

## 3. Routing Structure

```
/                          → Dashboard (Command Overview)
/alerts                    → Alerts
/heatmaps                  → Heatmaps
/blackspots                → Black Spots
/blackspots/:id            → Black Spot Detail
/road-health               → Road Health
/traffic                   → Traffic Analytics
/risk                      → Risk Analytics
/departments               → Department Performance
/departments/:id           → Department Detail / Ticket Queue
/city-pulse                → City Pulse Score
/reports                   → Reports
/users                     → Users (admin)
/settings                  → Settings (admin)
/audit-logs                → Audit Logs

# Public Portal (apps/portal)
/                          → Public Home Dashboard
/routes                    → Smart Route Planner
/road-health               → City Road Health Map
/blackspots                → Black Spot Explorer
/verify                    → AI Verification Center
/issues/:id                → Issue Tracking Portal
/transparency              → Public Transparency Dashboard
/wards/:id                 → Ward Intelligence
/alerts                    → Alert Center (subscriptions)
/participate               → Civic Participation Hub
```

Each route is lazy-loaded; `AnimatePresence` wraps the route outlet for page-transition animation per `DESIGN_SYSTEM.md` motion timing.

## 4. Page Structure

Every page follows the same composition contract:

```tsx
<PageHeader title breadcrumbs actions />
<ScopeFilterBar />              {/* ward/zone/date-range, persisted globally */}
<PageContent>
  <KpiRow />                    {/* if applicable */}
  <PrimaryVisual />             {/* map, chart, or table — the focal point */}
  <SecondaryPanels />           {/* supporting detail, drill-through */}
</PageContent>
```

Full per-page component/chart/filter/permission/API specification (all 13 dashboard pages, all 10 portal pages) is maintained as the canonical reference in `ARCHITECTURE.md` §5–6 — implement exactly to that spec; do not invent additional widgets without updating it first.

## 5. Feature Structure

Each feature folder (`features/<name>/`):

```
features/blackspots/
├── blackspotsApi.ts        # RTK Query endpoints
├── blackspotsSlice.ts      # local UI state only (server data lives in RTK Query cache)
├── components/
│   ├── BlackSpotList.tsx
│   ├── BlackSpotCard.tsx
│   ├── BlackSpotDetailPanel.tsx
│   └── WorkOrderDialog.tsx
├── hooks/
│   └── useBlackSpotFilters.ts
├── types.ts
└── index.ts                 # public exports only
```

## 6. Component Structure

- Domain-agnostic building blocks under `components/data/`: `KpiCard`, `ScoreGauge` (SVG `stroke-dashoffset`, animated), `StatusBadge` (severity/SLA colour + icon + label per `DESIGN_SYSTEM.md`), `ConfidenceBar` (AI → citizen → engineer composition visual), `DataTable` (TanStack Table wrapper).
- Map building blocks under `components/map/`: `MapShell`, `LayerControl`, `Legend`, `ClusterMarker`, `HeatmapLayer`.
- Reuse `ScoreGauge` and `StatusBadge` everywhere a score/severity appears — this is what keeps the visual language consistent across 20+ screens.

## 7. Redux Toolkit

**Global slices** (client state only — server data lives in RTK Query cache):

| Slice | Responsibility | Key State |
|---|---|---|
| `auth` | Session, current user, roles, jurisdiction scope | `user, token, roles[], scopeWards[], status` |
| `scope` | Global ward/zone/date-range selector | `wardId, zoneId, dateRange, severityFloor` |
| `ui` | Theme, nav collapse, active drawer, toasts | `theme, navCollapsed, drawer, toasts[]` |
| `map` | Layer visibility, viewport, selected feature | `layers{}, center, zoom, selectedFeatureId` |
| `realtime` | Socket connection state, live buffers | `connected, liveEvents[], liveTickets[], busPositions{}` |
| `notifications` | In-app notification tray | `items[], unreadCount` |

## 8. RTK Query

| API Slice | Endpoints | Caching Strategy |
|---|---|---|
| `dashboardApi` | getSummary, getKpis | 60s keepUnusedDataFor; refetch on focus |
| `alertsApi` | getAlerts, acknowledgeAlert | 30s polling while Alerts page mounted |
| `ticketsApi` | getTickets, getTicket, transitionTicket | Optimistic update on transition with rollback |
| `blackspotsApi` | getBlackspots, getBlackspot, createWorkOrder | 5min cache, invalidated by BlackSpot tag |
| `riskApi` | getWardRisk, getBreakdown, updateParameters | Invalidated on parameter mutation |
| `cityPulseApi` | getScore, getHistory, getBreakdown | 5min cache |
| `mapsApi` | getHeatmap, getWards, getLivePositions | Static geometry cached indefinitely; heatmap scope-keyed |
| `reportsApi` | generate, getStatus, download | Generation polled at 3s until terminal state |

## 9. State Management Principles

- Server data belongs in RTK Query, never duplicated into a Redux slice.
- Realtime events **patch** the RTK Query cache directly for high-frequency updates (event/position streams); invalidation (`tagTypes`) is reserved for changes affecting aggregates (scores, SLA summaries).
- Live buffers (`realtime.liveEvents`, `busPositions`) are capped (e.g. 200 events, 100 tickets) with oldest-out eviction.
- On socket reconnect, request a delta since the last received sequence number rather than refetching everything.

## 10. Reusable Components Checklist

`ScoreGauge` · `StatusBadge` · `ConfidenceBar` · `KpiCard` (with count-up animation) · `DataTable` · `MapShell` + `LayerControl` · `PageHeader` · `ScopeFilterBar` · `EmptyState` · `Skeleton` variants matching each layout · `Toast`/`Sonner` wrapper.

## 11. Forms Structure

- React Hook Form + Zod resolver; schema colocated with the feature (`features/<name>/schema.ts`), reused for both client validation and as the source of truth for the API payload type.
- Single-column layout, inline validation on blur, destructive actions behind a confirmation dialog — per `DESIGN_SYSTEM.md` §9.

## 12. Validation Strategy

- Zod schemas mirror backend Zod validation contracts (shared via `packages/types` where feasible) so a contract change surfaces as a type error at build time, not a runtime failure.
- Server is always the authority: client validation is UX, not security — every mutation is re-validated server-side (see `BACKEND.md`).

## 13. Dashboard Screens (apps/web)

Dashboard, Alerts, Heatmaps, Black Spots (+ detail), Road Health, Traffic Analytics, Risk Analytics, Department Performance (+ detail), City Pulse Score, Reports, Users, Settings, Audit Logs. Full spec: `ARCHITECTURE.md` §5.

## 14. Mobile App Screens (apps/mobile — React Native)

**Field Officer App:** Login → Today (assigned tickets) → Ticket Detail → Capture Proof → Resolve; Map (nearby assigned work); Verify (field verification queue); Profile (sync status, offline queue).

**Citizen App:** Home (city snapshot) → Map → Route Planner → Route Comparison → Route Detail; Report Issue → Capture → Locate → Submit; Verify; My Reports → Issue Timeline; Alerts (subscriptions).

Both share the design system and a subset of `packages/ui` components adapted for React Native (or a parallel native-styled set following identical tokens). Offline queueing uses a client-generated idempotency key per write, replayed in order on reconnect, with server-authoritative conflict resolution — never silently discard a queued action.

## 15. Public Portal Screens (apps/portal)

Public Home Dashboard, Smart Route Planner, City Road Health Map, Black Spot Explorer, AI Verification Center, Issue Tracking Portal, Public Transparency Dashboard, Ward Intelligence, Alert Center, Civic Participation Hub. Full spec: `ARCHITECTURE.md` §6. Uses the light-theme-default variant of the design system — warmer, friendlier, same token family.

## 16. Map Components

- `MapShell`: wraps Leaflet map instance, handles theme-aware tile layer swap (dark tile treatment vs. light).
- `LayerControl`: checkbox/toggle list bound to `map` slice `layers{}` state — Road Health, Traffic, Black Spot, Waterlogging, School Safety, Department, Construction, Route Quality, Citizen Report layers (public); + Incident layer (authority-only, restricted).
- `ClusterMarker`: activates above 50 points in view; expands on click/zoom.
- `HeatmapLayer`: grid-aggregated density rendering from `mapsApi.getHeatmap`.
- Legend anchored bottom-left; layer control always visible, never hidden behind a menu on desktop.
