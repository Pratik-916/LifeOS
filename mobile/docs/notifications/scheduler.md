# Scheduler

The `scheduler.ts` file acts as the boundary between our app logic and `expo-notifications`.

## Capabilities
- Schedules exact-date local notifications using deterministic identifiers to prevent duplicates.
- Resolves conflicts and avoids duplicate triggers.
- Enforces **Quiet Hours** policies by evaluating the requested trigger date against the user's preferences.

## Quiet Hours Strategies
When a notification is scheduled to fire during quiet hours, the Scheduler applies the chosen strategy:
1. `MOVE_TO_END`: Automatically shifts the trigger date to the exact minute quiet hours end (e.g., 08:00 AM next day).
2. `SUPPRESS`: Completely ignores the schedule request and drops the notification.
3. `ALLOW_CRITICAL`: Passes the notification through quiet hours unhindered.
