# Unified Dashboard Architecture

## Philosophy
The Dashboard is an orchestration layer, not a feature module. It composes the LifeOS experience by aggregating information from Planner, Goals, Habits, Journal, Journey, Analytics, and Blog modules. It performs presentation only and contains no business logic.

## Widget Composition
Widgets render independently using `<DashboardWidget>` and `<FeatureErrorBoundary>`. This ensures a single widget failure (e.g., a timeout in Goals) does not crash the entire Dashboard. Skeleton loaders are used instead of global loading spinners.

## React Query Reuse & Caching Strategy
The Dashboard rigorously reuses existing React Query hooks:
- `useTasks`
- `useGoals`
- `useHabits`
- `useJournalEntries`
- `useJourneyTimeline`
- `useBlogPosts`
- `useDashboardSummary`

Cache configuration ensures that if data is already requested by a module, the Dashboard reuses it without duplicate network calls. `staleTime` is preserved.

## Activity Feed
The `RecentActivity` widget consumes the backend-generated timeline data. It does not rebuild activity aggregation on the frontend.

## Quick Actions & Cross-Module Navigation
Every widget links directly to its owning module (e.g., the Goal Summary card navigates to `/goals`). Quick Actions trigger existing modal flows without duplicating UI code.

## Known Limitations
- Heavy layout personalization is currently limited.
- Widgets rely entirely on existing pagination and response structures of their host modules.

## Future Improvements
- Hide/Reorder/Resizable widgets.
- User-specific layouts and preferences.
