# Frontend Architecture

## Tech Stack
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **State Management:** Zustand (Global State) + React Query (Server State)
- **Styling:** Tailwind CSS + custom CSS tokens
- **Routing:** React Router v7
- **Animations:** Framer Motion

## Core Principles
1. **Feature-Sliced Design:** Modules are grouped by feature (`src/features/*`) rather than by type. A feature includes its own components, hooks, api layer, and types.
2. **Canonical Reference:** The `Planner` feature serves as the canonical reference implementation. All new features (Goals, Habits) must mirror its folder structure and conventions.
3. **Data Fetching:** React Query handles all server state. It provides automatic caching, optimistic updates, and background refetching. Global UI state is handled by Zustand.
4. **Resilience:** Features should be wrapped in `FeatureErrorBoundary` to prevent app-wide crashes, and offline handling is managed gracefully via `useOfflineStatus`.
