# Background Tasks

Uses `expo-background-fetch` and `expo-task-manager` for asynchronous background maintenance.

## Responsibilities
- Cleans up stale notifications.
- Validates the `storage.ts` mappings against active features.
- Can be triggered every ~15-60 minutes depending on iOS/Android battery constraints.
- NEVER used for precise notification triggering, only for queue maintenance.
