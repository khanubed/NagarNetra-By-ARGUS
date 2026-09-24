# NagarNetra Project Setup History

## 1. Monorepo Root Setup
- Initialized NPM Workspaces in `package.json` with scopes for `apps/*` and `packages/*`.
- Configured root-level scripts (`dev`, `build`, `lint`, `typecheck`, `db:migrate`).
- Created `docker-compose.yml` defining services:
  - `postgres` (with PostGIS 16)
  - `redis` (Redis 7)
  - `mqtt` (Mosquitto)
  - `minio` (S3 object storage)
- Created `.env.example` mapping to the docker-compose services.

## 2. Edge AI Environment (`edge/`)
- Created `models/` and `pipeline/` directories.
- Written `requirements.txt` with `ultralytics`, `onnxruntime`, `paho-mqtt`, and `opencv-python`.
- Created `simulate_fleet.py` stub to test telemetry ingestion without hardware.

## 3. Database Layer (`prisma/`)
- Configured `schema.prisma` with core models mapping to the Architecture specs:
  - `Event` model with AI & final confidence, deduplication counting, and lifecycle tracking.
  - `Ticket` model with SLA tracking, prioritization, and resolution requirements.
  - Required enums (`EventType`, `Severity`, `AccessClass`, `TicketState`, `EventStatus`).

## 4. Shared Packages (`packages/`)
- Scaffolded packages to allow code-sharing across the monorepo:
  - `packages/ui`: Intended for shared shadcn/ui components.
  - `packages/types`: Intended for shared TypeScript contracts & Zod schemas.
  - `packages/config`: Intended for shared ESLint, TypeScript, and Tailwind configurations.
  - `packages/scoring`: Intended for Urban Risk Index, City Pulse, and Route Quality Score formulas.

## 5. Applications (`apps/`)
- **API (`apps/api`)**: Scaffolded basic `package.json` for Express.js backend, including Prisma, BullMQ, and Socket.io dependencies.
- **Worker (`apps/worker`)**: Scaffolded basic `package.json` for BullMQ job processors.
- **Web (`apps/web`)**: Initialized via Vite with React + TypeScript template.
- **Portal (`apps/portal`)**: Initialized via Vite with React + TypeScript template.
- **Mobile (`apps/mobile`)**: Created directory structure for future React Native / Expo apps.

## 6. Dependency Resolution
- Executed `npm install` at the workspace root, installing all dependencies and symlinking the workspace packages. (Installed successfully with 0 vulnerabilities).

## 7. Mobile App Setup (apps/mobile/)
- Initialized Expo project with TypeScript (blank-typescript template).
- Installed state management and navigation dependencies (@reduxjs/toolkit, react-redux, @react-navigation/native, etc.).
- Created base directory structure:
  - src/app/ (Redux store configuration)
  - src/features/ (Domain-driven slices)
  - src/components/ (Shared UI components)
  - src/citizen/ (Citizen App specific screens)
  - src/field/ (Field Officer App specific screens)

## 8. Backend API Setup (apps/api/)
- Installed backend dependencies: Express, Prisma, BullMQ, Socket.io, Zod, Cors, Helmet, Morgan, jsonwebtoken, ioredis, mqtt, dotenv.
- Configured TypeScript via tsconfig.json.
- Created robust folder structure supporting domain-driven design (src/config, src/routes, src/controllers, src/services, src/repositories, src/jobs, src/realtime, src/mqtt, src/middleware, src/lib, src/types).
- Bootstrapped core files:
  - src/server.ts: Express application with middleware, a dummy /health route, and graceful shutdown handlers.
  - src/config/env.ts: Zod-based environment variable validation.
  - src/lib/prisma.ts: Singleton Prisma client wrapper.
- Successfully verified TypeScript compilation (npm run build).

## 9. Frontend Web Prototype (apps/web) - Foundation
- Initialized Tailwind CSS and shadcn/ui shared design system in packages/ui mapped to DESIGN_SYSTEM.md themes (Dark/Light).
- Configured React Router v6 with AppShell, NavRail (Sidebar), and CommandBar layout.
- Configured Redux Toolkit with RTK Query and a fakeBaseQuery to simulate API latency with mocked data (Bengaluru coordinates).
- Implemented core UI primitives: StatusBadge, ConfidenceBar, KpiCard.
- Implemented the Dashboard page with React-Leaflet live map, KPI metrics, and recent detection lists.
- Implemented the Alerts page with a tabular feed of incidents, confidence scores, and severity tagging.
- Remaining pages (Heatmaps, Risk Analytics, Governance, etc.) are scaffolded with placeholders in the router, ready for phase-by-phase implementation.

## 10. Frontend Prototyping Plan (Road Health, Traffic, Risk Analytics)
Based on `ARCHITECTURE.md` and `DESIGN_SYSTEM.md`, the plan for the next 3 pages using fake data:
1. **Road Health (`/road-health`)**:
   - *Goal*: Show segment-level condition scores and maintenance planning.
   - *UI Components*: `PageHeader`, map (`MapShell`) showing road segment polylines coloured by health (Good/Moderate/Poor/Critical), and a ranked `DataTable` of the worst-performing segments with defect density.
   - *Fake Data*: Array of major Bengaluru road segments with calculated health scores (0-100).
2. **Traffic Analytics (`/traffic`)**:
   - *Goal*: Show corridor performance, bottlenecks, route delay, and OD summary.
   - *UI Components*: `PageHeader`, `KpiCard`s for Average Speed/Congestion, a `Recharts` line chart for live vs historical congestion, and a list of active bottlenecks with estimated delays.
   - *Fake Data*: Corridors (e.g., Silk Board, ORR) with speed/delay metrics and active congestion zones.
3. **Risk Analytics (`/risk`)**:
   - *Goal*: Show Urban Risk Index leaderboard with full factor transparency.
   - *UI Components*: `PageHeader`, an aggregated Radar/Bar chart (`Recharts`) decomposing the URI into its 6 factors (Road Damage, Traffic Density, Accident Frequency, Waterlogging, School Proximity, Citizen Complaints), and a leaderboard of wards.
   - *Fake Data*: Simulated URI scores for Wards 150 (Bellandur), Ward 174 (HSR), etc., with varied factor breakdowns demonstrating the scoring formula.

## 11. Frontend Prototyping Plan (Governance & Admin)
Based on `ARCHITECTURE.md` and `DESIGN_SYSTEM.md`, the plan for the final 4 pages using fake data:
1. **Department Performance (`/departments`)**:
   - *Goal*: Show SLA compliance, resolution time, escalation, and reopen rate per department.
   - *UI Components*: `PageHeader`, top `KpiCard`s for City-wide SLA adherence, and a `DataTable` or card grid listing departments (PWD, Traffic Police, Drainage, etc.) with their SLA compliance % (color-coded), avg resolution time, open tickets, and reopen rate.
   - *Fake Data*: Array of departments with realistically varying metrics (e.g., PWD at 74% SLA, Traffic Police at 92%).
2. **City Pulse Refinement (`/city-pulse`)**:
   - *Goal*: Standardize the existing page to match the new architectural component contracts.
   - *UI Components*: Introduce `PageHeader` and refine the existing 30-day `AreaChart` and breakdown cards to strictly use the 0-100 severity color scale from `DESIGN_SYSTEM.md`.
3. **Reports (`/reports`)**:
   - *Goal*: Show templated report generation, scheduling, and archive.
   - *UI Components*: `PageHeader` (with "Generate Report" action), a grid of available "Templates" (e.g., "Monthly Ward Health", "SLA Breach Report"), and a `DataTable` for "Recent Archives" (Date, Name, Format, Download).
   - *Fake Data*: Template definitions and a history log of previously generated PDF/CSV reports.
4. **User Administration (`/users`)**:
   - *Goal*: Account, role, and jurisdiction administration.
   - *UI Components*: `PageHeader` (with "Add User" action) and a `DataTable`. Columns: Name, Role (Badge), Jurisdiction (Citywide vs specific Wards), Status (Active/Suspended), Last Active.
   - *Fake Data*: Users across the RBAC matrix (Commissioner, PWD Officer, Traffic Police, Field Engineer).

## 12. Edge AI Simulator (Hardware Telemetry Demo)
Implemented the `/edge-simulator` page to showcase the real-time onboard computer vision inference pipeline running on the edge hardware (NVIDIA Jetson Orin Nano).
- **Features**:
  - `KpiCard`s highlighting bandwidth savings (99.9% reduction, 18KB vs 12MB raw video), inference speed (~45ms via TensorRT), and total fleet bandwidth saved.
  - A **Camera Viewport HUD** cycling through mock images (`pothole.jpeg`, `waterlogging.jpeg`, etc.) every 3 seconds to simulate a live video feed. Includes a procedural scanline overlay, top HUD with recording status/speed/time, and bottom HUD with GPS/TPM status.
  - A **Live Detection Stream Log** that scrolls down with simulated real-time inference results (anomaly label, confidence, latency).
  - A dropdown selector in the `PageHeader` allowing users to switch between active buses, simulating multi-vehicle monitoring.

## 13. Public Portal Prototype (`apps/portal`)
- Initialized Tailwind CSS (v3.4.17) and bypassed Vite cache to resolve PostCSS plugin conflicts.
- Applied `DESIGN_SYSTEM.md` styling rules globally across the portal:
  - Restrained border radii: Flattened bubbly `rounded-2xl` components to strict `rounded-lg` or `rounded-md` civic-tech aesthetic.
  - Restrained typography: Refactored heavy `font-bold` labels into cleaner `font-semibold`, preserving `font-black` solely for primary KPIs.
- Implemented `react-router-dom` v7 with a fully responsive `PublicAppShell` layout and Top Navigation Header.
- Completed all frontend pages based strictly on `ARCHITECTURE.md` specs:
  - **Road Health (`/road-health`)**: Interactive Leaflet map with segment-scored polyline rendering and multi-type hazard filters (Pothole, Waterlogging, Cave-in).
  - **Smart Route Planner (`/route-planner`)**: 4 ranked route options (fastest/safest/best road quality/lowest congestion) utilizing simulated pathfinding algorithms and semantic color coding.
  - **Black Spot Explorer (`/black-spots`)**: Transformed the authority dashboard view into an educational, public-friendly interface highlighting causal factors (without exposing sensitive restricted-class data), including the "Why is this a Black Spot?" pitch.
  - **Verification Center (`/verification`)**: Citizen portal to review edge-case AI detections, strictly incorporating the segmented Confidence Composition Visual (AI Confidence -> Citizen Verification -> Engineer Verification). Uses local MOCK-IMAGES.
  - **Issue Tracker (`/track/:id`)**: Dynamic public ticket tracking via ID search (`useParams`/`useNavigate`), featuring a strict 6-stage horizontal SLA node-and-connector pipeline (Detect -> Ward -> Department -> Ticket -> Resolution -> Escalate). Handles 404 Not Found states and lists recent tickets when no ID is provided.
  - **Transparency Dashboard (`/transparency`)**: Real-time metrics visualization (Recharts) showing taxpayer savings, plus the required Department Scorecards table tracking SLA compliance (with visual progress bars) and resolution time.
  - **Ward Intelligence (`/ward-intelligence`)**: Localized leaderboards ranking 198 BBMP wards based on issue resolution rates and active hazards, with search/filtering capabilities.
  - **Alert Center (`/alerts`)**: Feed of active detours, waterlogging warnings, and an omnichannel subscription panel (Push/WhatsApp/SMS/Email).
  - **Civic Hub (`/civic-hub`)**: Landing page for the citizen mobile app with gamification logic (Civic Trust Points) and active Civic Campaigns (Voting & Feedback).
  - **Home Dashboard (`/`)**: High-impact landing page tying all the public-facing features together (City Pulse, Urban Risk Index Radar Chart, Live Leaflet Map, Live Active Feed).
