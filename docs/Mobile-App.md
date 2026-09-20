# NagarNetra Mobile Apps Documentation

This document outlines the architecture, setup, and structure of the mobile applications for NagarNetra. The mobile codebase is housed entirely within the `apps/mobile` directory in the monorepo.

## 1. Overview
As outlined in the `ARCHITECTURE.md` and `FRONTEND.md` specifications, the NagarNetra platform requires two distinct mobile experiences:
1. **Field Officer App**: For authority field engineers to view assigned tickets, capture proof of resolution offline, and close tickets.
2. **Citizen App**: For the general public to view city health, plan smart routes, report issues, and verify AI detections.

To maximize code reuse (e.g., design system, API integrations, map components), both experiences are built inside a single **Expo (React Native)** project workspace. 

## 2. Technology Stack
- **Framework**: React Native + Expo (using the `blank-typescript` template)
- **State Management**: Redux Toolkit (RTK) and `react-redux`
- **Routing/Navigation**: React Navigation (`@react-navigation/native` & `@react-navigation/stack`)
- **Language**: TypeScript

## 3. Directory Structure (`apps/mobile/src/`)
We have designed a domain-driven folder structure to cleanly separate the two app experiences while sharing core logic.

```text
apps/mobile/src/
├── app/
│   └── store.ts             # Centralized Redux Toolkit store setup
├── citizen/                 # Citizen App Specific Code
│   ├── screens/             # e.g., RoutePlanner, IssueReport, CitySnapshot
│   └── navigation/          # Bottom tabs and stack for the Citizen app
├── field/                   # Field Officer App Specific Code
│   ├── screens/             # e.g., AssignedTickets, ProofCapture, SyncQueue
│   └── navigation/          # Bottom tabs and stack for the Field app
├── features/                # Domain Slices (RTK state, hooks, local logic)
│   ├── auth/
│   ├── tickets/
│   ├── reports/
│   └── offlineSync/
├── components/              # Shared UI components (matching DESIGN_SYSTEM.md)
│   ├── map/
│   └── ui/
└── navigation/              # Root Navigator deciding which app to load based on Auth
```

## 4. How the "Twin App" Architecture Works
Instead of maintaining two separate repositories, the root navigator (`src/navigation/RootNavigator.tsx`) evaluates the authenticated user's role:
- If the user is logged in with the **Field Engineer** role, it renders the `FieldAppNavigator` (loaded from `src/field/navigation/`).
- If the user is a **Citizen** or unauthenticated, it renders the `CitizenAppNavigator` (loaded from `src/citizen/navigation/`).

## 5. State Management (Redux Toolkit)
The store is located at `src/app/store.ts`. 
All API calls and local state are divided into **Features** under `src/features/`.
- **RTK Query** is recommended for API calls to the Express backend.
- **Offline Capabilities**: Since Field Officers may lose connectivity, Redux state (specifically the `offlineSync` feature) acts as a queue for actions (like capturing proof of fix) that get replayed when connectivity is restored.

## 6. Running the App
To run the Expo server locally for development:
```bash
cd apps/mobile
npm run start
```
From the Expo CLI, you can press `a` to run on an Android emulator, `i` for an iOS simulator (macOS only), or scan the QR code with the Expo Go app on a physical device.
