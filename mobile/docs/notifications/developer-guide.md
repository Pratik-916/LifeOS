# Developer Guide: Notifications

## How to add a new Notification
1. Do **NOT** call `expo-notifications` directly.
2. In your feature's mutation hooks (e.g. `useTaskMutations`), add a call to `reminderEngine` within `onSuccess`.
3. In `reminderEngine.ts`, write your business logic. Calculate exactly when the notification should fire, considering timezones, date parsing, and quiet hours.
4. Call `notificationService.schedule(...)` from the engine. 

## Testing
Always mock `notificationService` in Jest. Test the `ReminderEngine` purely for its logical output (i.e. does it call schedule with the correct Date object?).
