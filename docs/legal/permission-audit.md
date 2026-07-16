# Permission Audit

This document tracks every OS-level permission requested by LifeOS on Android and iOS.

## 1. Current Active Permissions

### Network Access / Internet
- **Android Manifest**: `android.permission.INTERNET`
- **Purpose**: Required to synchronize data with the backend and send crash reports to Sentry.
- **Mandatory**: Yes, for sync features.
- **Store Justification**: Core app functionality.

### Notifications
- **iOS / Android**: Remote & Local Notifications (`expo-notifications`).
- **Purpose**: To deliver habit reminders, daily planning alerts, and journaling prompts.
- **Mandatory**: No. The app functions entirely without notifications.
- **User Benefit**: Helps maintain consistency and streaks.

### Background Fetch
- **iOS / Android**: Background execution (`expo-background-fetch`).
- **Purpose**: Used periodically to sync local offline data with the cloud when the app is in the background, ensuring data is not lost.
- **Mandatory**: No. Sync can happen manually in the foreground.

## 2. Future Planned Permissions (Not Currently Active)

### Camera / Photo Library
- **Future Use**: Attaching images to Journal Entries or Journey Memories.
- **Current Status**: **NOT REQUESTED**.

### Location
- **Future Use**: Tagging journal entries with geolocation.
- **Current Status**: **NOT REQUESTED**.

### Microphone
- **Future Use**: Voice-to-text journal entries.
- **Current Status**: **NOT REQUESTED**.

### Biometrics (FaceID / TouchID)
- **Future Use**: Locking the app behind a privacy screen.
- **Current Status**: **NOT REQUESTED**.

## 3. Verification
Verified against `app.json` and compiled native manifests on July 2026. No unused permissions are currently embedded in the application bundle.
