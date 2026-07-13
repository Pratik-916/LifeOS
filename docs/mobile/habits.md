# Mobile Habits Module

The Mobile Habits module extends the LifeOS platform into native mobile, mirroring the highly robust Django backend architecture while injecting native interactions designed for quick, everyday completion.

## Architecture & Data Flow
1. **API Mirroring**: The `src/features/habits/api/` folder contains identical type signatures and DTO conversions as the React Web client. Endpoints map to the same Django backend (`/api/v1/habits/habits/`).
2. **React Query Hooks**: `src/features/habits/hooks/` abstract all data fetching and mutations. We use aggressive cache invalidation combined with optimistic UI rendering.
3. **Backend Authority**: Unlike offline-first habit trackers, LifeOS retains streak calculation, longest streak tracking, and completion rates solely on the backend. This prevents drift between the web and mobile applications. The mobile app exclusively reads these metrics.

## Navigation & Routing
The module is integrated using the hybrid **Root Stack + Bottom Tabs** topology.
- `HabitScreen` is embedded inside the Bottom Tab bar.
- `HabitDetailsScreen`, `HabitEditorScreen`, and `HabitSearchScreen` are pushed onto the overarching `MainStack`. This automatically hides the tab bar when a user needs focused attention to edit or review a habit.

## Key Features & UI/UX Patterns
- **Swipe-to-Complete**: `HabitCard` implements swipe gestures (`react-native-gesture-handler`) for completing and archiving habits. Alternatively, users can tap the circular checkbox directly.
- **Progress Ring**: For habits with `target_count > 1`, a custom SVG `HabitProgressRing` visually displays partial completions.
- **Draft Persistence**: `HabitEditorScreen` auto-saves input (via `react-hook-form`'s `watch` and `AsyncStorage`). 
- **Offline Resiliency**: In the absence of network connectivity, the cached Habit list and Statistics remain visible, providing read-only access.
- **Native Pickers**: We use `@react-native-community/datetimepicker` for reminder time selection.

## Future Notifications Integration
The database schema (`reminderTime`, `reminderEnabled`) and frontend DTOs already perfectly align with a future local push notification implementation. 
When notifications are built:
1. `HabitEditorScreen` will request permissions.
2. `useHabitMutations` will hook into Expo Notifications to schedule/cancel local triggers based on `reminderTime`.
