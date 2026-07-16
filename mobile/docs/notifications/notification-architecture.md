# Notification Architecture

The notification engine provides local push notifications, background tasks, and a centralized reminder engine for LifeOS.

## Principles
1. **Centralized Scheduling**: Notification delivery is handled by `NotificationService`.
2. **Centralized Logic**: Business logic for scheduling resides in `ReminderEngine`.
3. **Feature Agnostic**: `useTaskMutations` simply calls `reminderEngine.processTask()`, decoupling features from notification implementations.
4. **Offline Compatible**: Scheduling happens simultaneously with optimistic mutations, even offline.

## Core Modules
- `notificationService.ts`: Core wrapper around `expo-notifications`. Registers background listeners, handles permission checks (including `AppState` background-to-foreground permission revocation detection), and exports methods like `schedule` and `cancel`.
- `reminderEngine.ts`: The central business logic unit. All feature hooks (Planner, Habits, etc.) pass their entity states here. The engine computes whether a notification is valid, applies offsets, and calls `notificationService`.
- `scheduler.ts`: Responsible for final timing adjustments. Resolves Quiet Hours constraints (`MOVE_TO_END`, `SUPPRESS`) and pushes scheduling requests to an internal batched queue to protect the UI thread during bulk operations.
- `storage.ts`: A lightweight `AsyncStorage` module tracking `<Entity ID> -> [Notification IDs]`.
- `backgroundTasks`: Handles periodic maintenance via `expo-background-fetch`.
- `useNotificationStore`: Zustand store for preferences.
