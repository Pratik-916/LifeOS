# Dashboard Architecture

The Dashboard module acts as the unified control center for LifeOS. It orchestrates data from Planner, Goals, Habits, Journal, Journey, Analytics, and Blog modules into a single, cohesive view.

## Architectural Principles

1. **Orchestration Only**: The Dashboard module does not own any business logic. It delegates data fetching and state management to the respective feature modules.
2. **Cache Reuse**: The Dashboard exclusively reuses existing React Query hooks and caches (`useDashboardSummary`, `useHabits`, `useGoals`, etc.). It avoids duplicate data fetching.
3. **No Dedicated Backend**: The Dashboard operates without a dedicated `/dashboard` endpoint on the backend. It aggregates data client-side. The only exception is the Recent Activity feed, which points directly to `/activities/`.
4. **Independent Rendering**: Every widget is wrapped in a `FeatureErrorBoundary` and manages its own loading (`Skeleton` loaders) and error states independently. A failure in one widget never crashes the Dashboard.

## Component Structure

- **`Dashboard.tsx`**: The main page container setting the layout and greeting.
- **`DashboardOverview.tsx`**: The grid layout orchestrating all widgets.
- **`QuickActions.tsx`**: A horizontal, scrollable row of quick action buttons navigating users to creation flows.
- **`DashboardWidget.tsx`**: A shared wrapper component standardizing widget headers, refresh logic, error boundaries, and loading states.
- **Feature Cards**: `ProductivityCard`, `UpcomingTasksCard`, `HabitCard`, `GoalCard`, `JournalCard`, `JourneyCard`, and `BlogCard`.

## Future Personalization

The architecture is designed to support future personalization seamlessly:
- **`DashboardWidgetConfig`**: Defines standard widget sizes (`small`, `medium`, `large`), visibility, and order.
- **`useDashboardWidgets.ts`**: Currently returns a static array but is structured to fetch this configuration from a backend user preferences endpoint in the future.
- **No breaking changes**: Personalization can be added by simply replacing the `queryFn` in `useDashboardWidgets` to hit the backend without touching the rendering logic.

## Cross-Module Navigation

Widgets are inherently interactive and serve as entry points to their respective modules. Each widget header and item supports direct navigation to the detailed view within the feature module (e.g., clicking an Upcoming Task navigates to `/planner`).

## Performance and Caching

- `useRecentActivity` and `useDashboardSummary` implement a 15-second `staleTime` to prevent spamming the backend while ensuring data freshness.
- `useQuickActions` implements a 5-minute `staleTime`.
- All other widgets inherit the cache configurations set natively by their respective domain hooks.
