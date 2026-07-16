# Third-Party Services Audit

LifeOS is built on a minimal dependency stack to preserve privacy. This is an audit of all active external network services.

## 1. Hosting & Database (Backend)
- **Service**: AWS / Render (or equivalent deployment target).
- **Purpose**: Hosts the Django REST API and PostgreSQL database.
- **Privacy Impact**: Stores encrypted (in-transit) task, habit, and journal data. 
- **Data Processing**: Only processes data necessary for cross-device synchronization.

## 2. Diagnostics & Crash Reporting
- **Service**: Sentry (`@sentry/react-native`).
- **Purpose**: Captures fatal exceptions and stack traces to fix app crashes.
- **Privacy Impact**: Collects OS version, device model, and stack traces. Configured to explicitly scrub PII (Personally Identifiable Information).

## 3. Notifications
- **Service**: Expo Push Notifications Service / APNs (Apple) / FCM (Google).
- **Purpose**: Delivers local and remote reminders to the device.
- **Privacy Impact**: Notification payload data passes through Apple/Google servers. We do not place sensitive journal content inside notification payloads.

## Services explicitly NOT used:
- Google Analytics
- Firebase Analytics / Crashlytics
- Facebook Pixel
- Mixpanel
- Amplitude
- Any advertising or behavioral tracking SDKs.
