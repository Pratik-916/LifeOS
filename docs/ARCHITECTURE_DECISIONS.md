# Architectural Decisions

This document serves as a record of the major engineering decisions made for LifeOS to ensure that future contributors understand the reasoning behind the architecture.

## Why Django REST Framework
Django provides a robust, battery-included ecosystem that accelerates backend development. DRF extends this with powerful serialization, authentication, and viewsets. It inherently supports server-side sorting, filtering, and pagination, reducing the burden on the frontend.

## Why React Query
React Query acts as the single source of truth for **server state**. It handles caching, deduplication, background refetching, and optimistic updates elegantly. Manually managing server state in Redux or Zustand leads to massive boilerplate and caching bugs.

## Why Zustand stores only UI state
Global state managers are often abused to store API data. In LifeOS, Zustand is strictly limited to **ephemeral UI state** (e.g., dark mode preferences, modal toggles, sidebar state). This separation of concerns prevents synchronization issues between the client and the backend database.

## Why DTO Mapping exists
Python uses `snake_case` while JavaScript/TypeScript uses `camelCase`. Rather than forcing one language to abandon its conventions, we use Data Transfer Objects (DTOs) and mappers at the API boundary layer in the frontend. This ensures idiomatic code on both sides of the stack.

## Why Feature-First architecture
Grouping files by type (e.g., putting all components in one folder and all hooks in another) scales poorly. LifeOS uses a Feature-Sliced Design (`src/features/*`), placing components, hooks, and API clients that belong to the same domain together. This makes deleting, updating, or understanding a feature significantly easier.

## Why Query Key Factories
Hardcoding string keys for React Query (e.g., `'tasks'`) makes cache invalidation brittle and prone to typos. Query Key Factories (`plannerKeys`) provide a strongly typed, hierarchical structure. We can safely invalidate `plannerKeys.lists()` without accidentally purging `plannerKeys.statistics()`.

## Why Feature Error Boundaries
A single crashing component should not result in a white screen for the entire application. By wrapping modules (like Planner) in `<FeatureErrorBoundary />`, we isolate failures. Users can continue using the rest of the dashboard while the failed module displays a localized "Try Again" fallback.

## Why Offline hooks
Modern web apps are expected to handle network drops gracefully. `useOfflineStatus` provides immediate visual feedback and prevents the UI from firing off mutations that are guaranteed to fail.

## Why Planner became the canonical frontend architecture
The Planner was the first module completely integrated with the backend. It battle-tested the pagination UI, DTO mappers, optimistic updates, query keys, and error boundaries. Establishing it as the canonical standard ensures that all future modules (Goals, Habits, etc.) adhere to a proven, highly resilient template without reinventing the wheel.
