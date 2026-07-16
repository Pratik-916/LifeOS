# User Preferences

Zustand store (`useNotificationStore.ts`) powers local user preferences regarding notifications.

## Store Shape
- `globalEnabled`: Hard kill-switch for all notifications.
- Feature switches: `plannerEnabled`, `habitsEnabled`, `goalsEnabled`, `journalEnabled`, `journeyEnabled`.
- Quiet Hours logic (`quietHoursEnabled`, `quietHoursStart`, `quietHoursEnd`).

## Synchronization
While currently stored locally via `AsyncStorage`, it is designed to eventually sync with the Django backend.
