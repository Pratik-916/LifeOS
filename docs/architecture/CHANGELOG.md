# Architecture Changelog

All notable architectural changes to the LifeOS frontend and backend will be documented in this file.

## [v2.0.2-planner-production] - 2026-07-08
### Added
- **Feature Error Boundaries**: Added `FeatureErrorBoundary` to isolate feature crashes from the entire application.
- **Offline Handling**: Added `useOfflineStatus` hook and indicator to gracefully handle lack of connectivity.
- **Pagination Component**: Reusable pagination UI connected to DRF's paginated responses.
- **Optimistic Undo UX**: Implemented a 5-second undo toast for destructive actions (Delete).
- **Bundle Analysis**: Integrated `rollup-plugin-visualizer` into the build pipeline.

### Changed
- **Planner Architecture Freeze**: The Planner module is now frozen and serves as the canonical reference for all future feature implementations.
- **Backend Sorting**: Migrated all sorting logic from the frontend to the backend using Django's `OrderingFilter`.
- **Query Prefetching**: Implemented `queryClient.prefetchQuery` for instantaneous page transitions.
- **Cache Invalidations**: Refactored query keys to invalidate strictly scoped segments (e.g., `.lists()`) instead of `.all()`.
