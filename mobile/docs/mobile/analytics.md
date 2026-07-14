# Analytics Mobile Module

The Analytics module for the React Native application acts as a comprehensive, strictly-typed data aggregator, adhering purely to the LifeOS Feature-First Architecture.

## Architecture

This module pulls solely from the Django backend. **Zero analytical calculations are performed locally on the mobile client.** The React Native application is explicitly limited to data presentation and request parameterization (e.g., date ranges, categories).

### Components & Libraries
- **Networking**: `axios` bridged via `src/api/client.ts`.
- **State Management**: `@tanstack/react-query` exclusively handles the server state. The cache is aggressively populated (`staleTime: 300000` or 5 minutes).
- **Charts**: `react-native-gifted-charts` is utilized for lightweight, performant, Expo-compatible SVGs providing Bar, Line, and Pie graphs.
- **Routing**: Embedded deep directly into the `MainStack`. Accessed via the `DashboardScreen` (`View Analytics` button).

## Data Structure & Mappers

Endpoints are mapped 1:1 against the Django schema defined in `backend/apps/analytics/serializers.py`:

| Hook / Service | Backend Endpoint | DTO Map |
| -------------- | ---------------- | --------|
| `useAnalyticsDashboard` | `/api/v1/analytics/dashboard/` | `DashboardSummaryDTO` -> `DashboardSummary` |
| `useProductivityStats` | `/api/v1/analytics/productivity/` | `ProductivityAnalyticsDTO` -> `ProductivityAnalytics` |
| `useGoalAnalytics` | `/api/v1/analytics/goals/` | `GoalAnalyticsDTO` -> `GoalAnalytics` |
| `useHabitAnalytics` | `/api/v1/analytics/habits/` | `HabitAnalyticsDTO` -> `HabitAnalytics` |
| `useJournalAnalytics`| `/api/v1/analytics/journal/` | `JournalAnalyticsDTO` -> `JournalAnalytics` |
| `useJourneyAnalytics`| `/api/v1/analytics/journey/` | `JourneyAnalyticsDTO` -> `JourneyAnalytics` |
| `useAnalyticsHeatmap`| `/api/v1/analytics/heatmap/` | `Record<string, unknown>` -> `Record<string, unknown>` |

*All incoming keys are strictly parsed from `snake_case` to `camelCase` by `analytics.mapper.ts`.*

## Performance Optimization
1. **Memoization**: Chart components (`ProductivityChart`, `TrendChart`) utilize `React.memo` wrapping and `useMemo` hooks against the incoming `ChartDataset` object to ensure they only re-calculate paths when references shift.
2. **Offline Support**: Queries persist inside the internal React Query cache allowing access under intermittent connections.

## Future Export Support
No current feature implements PDF or CSV exporting, but structural scaffolding enables quick adoption via placeholder integrations if required down the line.
