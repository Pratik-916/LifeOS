# Contributing Guide

## How to add a new Feature Module
LifeOS uses a Feature-First Architecture. If you are adding a new module (e.g., Goals, Habits, Journal), follow these rules:

1. **Backend Application:** Create a new Django app in `apps/<feature_name>`. Do not put feature models in the core app. Register the app in `settings.py`.
2. **Frontend Folder:** Create a new folder under `src/features/<feature_name>`.
3. **Reference Architecture:** Use the `planner` feature as your canonical reference. Mirror its folder structure:
   - `api/` (API client, DTO mappers, Query Keys, Types)
   - `hooks/` (React Query mutations and queries)
   - `components/` (Feature-specific UI)
   - `pages/` (Top-level feature routes)
4. **State Management:** Keep all server state in React Query. Only use Zustand for ephemeral UI state (like Modals or global settings).
5. **Quality Control:** Ensure your new feature is wrapped in a `<FeatureErrorBoundary />` to prevent app-wide crashes, and integrate `useOfflineStatus` to disable actions gracefully during network drops.
