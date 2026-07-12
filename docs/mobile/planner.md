# Mobile Planner Module

The Mobile Planner module successfully brings the robust Django-driven Planner architecture to the React Native application. It emphasizes native touch conventions, optimistic caching, and offline-resilient UI patterns while perfectly mirroring the backend domain contracts.

## Architecture & Data Flow
1. **API Mirroring**: The `src/features/planner/api/` folder contains identical type signatures and DTO conversions as the React Web client. Endpoints map to the same Django backend (`/api/v1/planner/tasks/`).
2. **React Query Hooks**: `src/features/planner/hooks/` abstract all `useQuery` and `useMutation` implementations. We use aggressive cache invalidation strategies (e.g. invalidating `plannerKeys.all` upon mutations) while optimistically injecting payload responses directly into the cache.

## Navigation & Screen Depth
The module is integrated using a hybrid **Root Stack + Bottom Tabs** topology.
- `PlannerScreen` is embedded inside the Bottom Tab bar.
- To maximize screen real-estate and remove distractions, `TaskDetailsScreen`, `TaskEditorScreen`, and `TaskSearchScreen` are pushed onto the overarching `MainStack`. This automatically hides the tab bar when a user focuses on a single task.

## Key Features & UI/UX Patterns
- **Swipe-to-Action**: `TaskListItem` integrates `react-native-gesture-handler` providing swipe left to Complete, and swipe right to Delete tasks.
- **Draft Persistence**: `TaskEditorScreen` employs `AsyncStorage` under the `@planner_draft` key. As the user types, a debounced auto-save captures their input. If the app crashes, the unsaved form state is automatically hydrated upon return.
- **Native Pickers**: We use `@react-native-community/datetimepicker` to summon native iOS/Android date selection wheels rather than building custom UI.
- **Debounced Search**: `TaskSearchScreen` executes backend-driven queries with a `500ms` debounce to prevent network thrashing, as instructed, rather than attempting to filter massive datasets natively.

## Future Enhancements
- **Calendar Integration**: The foundation is ready for a `CalendarMonthScreen` which will simply call `useTasks({ ...filters })` with boundary dates.
- **Pomodoro/Stopwatch**: A future phase will introduce timer state management. Since `TaskDetailsScreen` exposes `actual_minutes`, it is fully prepped to receive timer payloads.
