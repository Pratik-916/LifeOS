# Scheduler

The `scheduler.ts` file acts as the boundary between our app logic and `expo-notifications`.

## Capabilities
- Schedules exact-date local notifications.
- Maintains `NotificationStorage` mappings between logical `entityId` and OS `notificationId`.
- Resolves conflicts, avoids duplicate triggers, and manages quiet hours constraints.
