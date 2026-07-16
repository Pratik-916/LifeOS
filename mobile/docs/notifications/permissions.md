# Permissions

Handles platform-aware permissions for Android and iOS using `expo-notifications`.

## Best Practices
- Never request on first launch.
- Request only when the user explicitly enables a reminder feature or toggle.

## Implementation Details
Android: Implements `AndroidImportance` and notification channels.
iOS: Requests Alert, Badge, and Sound authorization.
