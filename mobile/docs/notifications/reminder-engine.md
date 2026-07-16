# Reminder Engine

The `ReminderEngine` dictates *when* and *why* a notification is sent.

## Lifecycle
1. User mutates an entity (e.g. completes a habit).
2. The mutation hook invokes `reminderEngine.processHabit(habit)`.
3. The engine computes if the reminder is still valid. 
4. If invalid (e.g. habit completed), it calls `notificationService.cancel(habit.id)`.
5. If valid, it computes the trigger time and assigns a **deterministic identifier** (e.g., `habit-{habit.id}-daily`).
6. It calls `notificationService.schedule(...)`. 

## Deterministic Identifiers
By assigning a static, predictable ID during scheduling, `expo-notifications` will automatically overwrite existing queued notifications if the user edits a task multiple times (e.g., offline mode), preventing duplicate scheduling bugs.

## Future Scalability
This decoupled design ensures that if Firebase Cloud Messaging (FCM) or Apple Push Notifications (APNs) are integrated, only `NotificationService` requires updates, while `ReminderEngine` and the Feature modules remain identical.
