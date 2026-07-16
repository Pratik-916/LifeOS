# Notification Architecture

The notification engine provides local push notifications, background tasks, and a centralized reminder engine for LifeOS.

## Principles
1. **Centralized Scheduling**: Notification delivery is handled by `NotificationService`.
2. **Centralized Logic**: Business logic for scheduling resides in `ReminderEngine`.
3. **Feature Agnostic**: `useTaskMutations` simply calls `reminderEngine.processTask()`, decoupling features from notification implementations.
4. **Offline Compatible**: Scheduling happens simultaneously with optimistic mutations, even offline.

## Core Modules
- `notificationService`: Wrapper over `expo-notifications` for generic delivery.
- `reminderEngine`: Examines feature entities and delegates to `notificationService`.
- `backgroundTasks`: Handles periodic maintenance via `expo-background-fetch`.
- `useNotificationStore`: Zustand store for preferences.
