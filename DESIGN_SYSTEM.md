# Design System — NagarNetra

Related: [`FRONTEND.md`](./FRONTEND.md)

This is the binding visual language for every surface: authority dashboard, public portal, and mobile apps. If a screen doesn't match this document, the screen is wrong, not the document.

---

## 1. Design Philosophy

Three principles govern every screen:

1. **Evidence before assertion.** Every score, ranking, and alert must be traceable to the observations that produced it within two interactions. No number appears without a path to its inputs.
2. **Density with hierarchy.** Government operations screens legitimately carry high information density. The discipline is one clear focal point per screen and a consistent scan order — not less information.
3. **Consequence visibility.** Anything overdue, breaching, or high-risk must be identifiable without reading text, through position, colour, and shape together.

**Quality bar:** this must not read as a default AI-generated app — no untouched shadcn zinc theme, no purple gradient blobs, no Inter-only typography, no emoji-as-icons, no auto-inverted dark mode. Reference influences: the operational density of Palantir-style intelligence platforms and the structured clarity of management-consulting reporting, adapted for public-sector legibility over visual novelty. The Public Portal shifts to a warmer, friendlier tone — same system, softer execution — since its audience and stakes differ from the command dashboards.

## 2. Dark Theme (default for authority dashboard, field/GIS pages)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#0B0E14` | Application base surface |
| `--surface` | `#141822` | Cards, panels, table rows |
| `--surface-raised` | `#1C212C` | Modals, popovers, dropdowns |
| `--border` | `#242B38` | Dividers, outlines, table rules |
| `--foreground` | `#E8ECF3` | Primary text |
| `--muted-foreground` | `#8B94A4` | Secondary text, labels, captions |
| `--primary` | `#3B9FE0` | Primary actions, active nav, links |
| `--accent` | `#2CC4C9` | Secondary emphasis, data highlights |
| `--restricted-accent`| `#DC2626` | Deep Red/Amber for law enforcement/ANPR modules |

Not pure black: layered near-black surfaces so cards visibly "lift" off the background. Accent colours are desaturated/brightened relative to light mode so they don't vibrate against dark backgrounds.

## 3. Light Theme (default for public portal, citizen app)

| Token | Value | Usage |
|---|---|---|
| `--background` | `#F7F9FB` | Application base surface (not pure white) |
| `--surface` | `#FFFFFF` | Cards, panels, elevated content |
| `--surface-raised` | `#FFFFFF` | Modals, popovers (shadow-differentiated) |
| `--border` | `#E2E8F0` | Dividers, outlines |
| `--foreground` | `#0F172A` | Primary text |
| `--muted-foreground` | `#5A6472` | Secondary text |
| `--primary` | `#1B6CA8` | Primary actions, links |
| `--accent` | `#0E7C86` | Secondary emphasis |

Every screen must be checked and explicitly styled in **both** modes — nothing is "forgotten" and left broken or washed out. Command-center pages default to dark; the Public Portal defaults to light; both fully support switching. Theme toggle animates (icon morph / smooth crossfade), never an instant jarring flash, and persists the user's choice with a System option.

## 4. Colour Tokens — Severity & Score Scale

One colour language for severity, SLA state, and all 0–100 scores, used identically everywhere so the meaning is learned once.

| Band | Score Range | Light | Dark | Applied To |
|---|---|---|---|---|
| Good / Low | 80–100 | `#15803D` | `#4ADE80` | Low severity, healthy score, SLA on track |
| Moderate / Medium | 60–79 | `#B45309` | `#FBBF24` | Medium severity, acceptable score, SLA approaching |
| Poor / High | 40–59 | `#C2410C` | `#FB923C` | High severity, degraded score, SLA at risk |
| Critical | 0–39 | `#B91C1C` | `#F87171` | Critical severity, failing score, SLA breached |

**Rule:** colour is never the sole carrier of meaning — every severity indicator pairs colour with an icon and a text label (colourblind accessibility + legibility on projected displays).

## 5. Typography

| Role | Family | Weights | Usage |
|---|---|---|---|
| Display / Headings | Space Grotesk | 500, 600, 700 | Page titles, section headings, KPI values |
| Body / UI | Inter | 400, 500, 600 | Body copy, labels, table content, form fields |
| Numeric / Code | JetBrains Mono | 400, 500 | IDs, coordinates, hashes, code/payload blocks |

- Type scale (px): 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60.
- Line height: 1.5 body, 1.2 display.
- Tabular numerals enabled on all data tables and KPI figures so digits align across rows.
- Do not use Inter for everything — the display/body pairing is intentional and must read as a considered choice, not a default.

## 6. Grid System

- 12-column fluid grid, 24px gutter, max content width 1600px for analytics pages, full-bleed for map pages.
- 8px base spacing scale throughout: 4, 8, 12, 16, 24, 32, 48, 64, 96px. No arbitrary values (no `mt-[13px]`).
- Radius scale: 6px inputs/badges, 12px cards/panels, 16px modals, 999px pills/avatars — applied via theme token, not ad hoc.
- Elevation: 3 levels only — flat (border only), raised (`0 1px 3px rgba(0,0,0,.08)`), floating (`0 8px 24px rgba(0,0,0,.12)`). Dark mode substitutes surface lightness for shadow depth.

## 7. Components

| Component | Standard |
|---|---|
| Cards | Title row + optional action slot; body; optional footer. 24px padding. Never nest more than one level deep. |
| Badges | Severity/status/score badges always pair icon + colour + text label. |
| Buttons | Primary (one per view), secondary, ghost, destructive. Min 44px touch target. Loading state replaces label with spinner, never silently disables. |
| Skeletons | Every async region has a skeleton matching its final layout — blank flashes are treated as defects. |
| Empty states | Illustration + one-line explanation + primary action. Never a blank panel. |

## 8. Tables

- Sticky header, zebra rows, right-aligned numerics with tabular figures.
- Row hover highlight, per-column sort, explicit empty and loading states.
- Virtualise above 200 rows (TanStack Table + virtualiser).

## 9. Forms

- Single-column layout, label above field, inline validation on blur, helper text below field.
- Destructive actions require explicit confirmation (dialog, not just a colour change).
- Schema-driven validation shared between client (Zod) and server contract — see `FRONTEND.md` §Validation Strategy.

## 10. Charts

- Recharts, themed axes/gridlines/tooltips per theme — never leave default library styling.
- Consistent series colours across pages; accessible data-table fallback for every chart; no chart junk, no 3D effects.
- Number count-ups animate from 0 (or previous value) over ~600–800ms on scroll/mount, not an instant jump.

## 11. Maps

- Layer control always visible; legend anchored bottom-left.
- Cluster markers above 50 points.
- Dark-mode tile treatment matched to theme (custom dark tiles or CSS filter-based inversion) — never a bright rectangle on a dark page.
- Keyboard-navigable markers.

## 12. Navigation

- Persistent left navigation rail, grouped: Operations (Dashboard, Alerts, Tickets) · Intelligence (Heatmaps, Black Spots, Road Health, Traffic, Risk) · Governance (Department Performance, City Pulse, Reports) · Administration (Users, Settings, Audit Logs).
- Top command bar: global search, ward/zone scope selector, date range, live-connection indicator, notification tray, theme toggle, user menu.
- Global scope selector state persists across pages until explicitly reset.
- Sticky nav gets a subtle blur/height-shrink effect on scroll past the hero (public portal / landing contexts).

## 13. Layout Rules

- One clear focal point per screen — resist the urge to give every widget equal visual weight.
- Command-center pages: high density is acceptable and expected; discipline comes from grouping and hierarchy, not from removing content.
- Public-facing pages: generous whitespace, larger type, fewer simultaneous data points per screen.

## 14. Responsive Rules

- Full responsiveness down to tablet width at minimum on every authority page.
- Public Portal and Citizen App must also work well at phone width.
- Complex visuals (hero gauges, pipeline diagrams, GIS maps) reflow to a stacked/vertical layout on mobile — never just shrink-and-clip.

## 15. Accessibility

- WCAG 2.1 AA contrast minimums in both themes, verified for text and all severity colour pairings.
- Full keyboard operability including map marker traversal and layer toggles; visible focus rings on every interactive element.
- Semantic landmarks and ARIA labelling on charts/map controls; tabular fallback for every chart.
- Respect `prefers-reduced-motion` — disable non-essential animation, shorten transitions.
- Minimum 44px touch targets on mobile/tablet.

## 16. Design Patterns

- **Scores always show their formula on demand** — a gauge or KPI is never terminal; clicking/tapping reveals the factor breakdown (Urban Risk Index, City Pulse, Route Quality).
- **Before/after contrast for the Black Spot Intelligence Engine**: a deliberately underwhelming "plain pothole" state next to the rich, multi-factor "black spot" state — the contrast is the pitch.
- **Confidence composition visual**: a filling, segmented bar showing AI confidence → citizen-verified checkmark → engineer-verified checkmark → final confidence, used consistently anywhere verification appears.
- **SLA/escalation pipeline visual**: a horizontal node-and-connector diagram (Detect → Ward → Department → Ticket → Resolution → Escalate) used in onboarding, reporting, and the pitch landing page.
- **Motion timing scale** (used everywhere, not ad hoc): fast = 150ms, base = 250–300ms, slow = 600–1200ms (count-ups/gauges only). Page transitions fade + 8px slide; list/card reveals stagger 40–80ms; live-arrival items get a highlight-glow fading over ~1.5s; hover/tap use subtle `scale(1.0→1.015 / →0.98)`.
