# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Phase 10C**: Full production integration of the Goals module with the Django backend.
- Added `docs/architecture/goals.md` detailing the canonical frontend architectural patterns applied to the Goals module.

### Changed
- Refactored `GoalCard`, `GoalModal`, `GoalStatistics`, and `Goals` page to consume React Query hooks instead of Zustand local state.
- `useAppStore` no longer manages the `goals` collection (removed `goalSlice`).
- Pagination, filtering, and sorting for Goals are now synchronized with URL Search Parameters.
- Backend now acts as the single source of truth for Goal progress calculations and milestone completions.
- Migrated all API calls to utilize the central `axiosInstance` with strict DTO typing and mappers.

### Removed
- Removed all mock implementations and client-side calculations for Goals.
- Removed `goalSlice.ts` from local state.
