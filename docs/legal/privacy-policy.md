# Privacy Policy

**Effective Date:** July 2026

## 1. Introduction
Welcome to LifeOS ("we", "our", "us"). We are committed to protecting your privacy and ensuring you maintain control over your personal data. This Privacy Policy explains how we collect, use, and safeguard your information.

## 2. Data We Collect & How We Use It
LifeOS operates on an **Offline-First** architecture. 

### A. Core Application Data (Planner, Habits, Goals, Journal)
- **Offline Storage**: Your tasks, habits, journal entries, and journey memories are stored locally on your device first (`AsyncStorage` / SQLite).
- **Synchronization**: If you create an account, this data is encrypted in transit (TLS) and synchronized with our backend (Django/PostgreSQL) strictly for the purpose of cross-device syncing and cloud backup. 
- **We DO NOT** sell this data, use it for advertising, or read your private journal entries.

### B. Account Information
- **Registration**: If you choose to sync data, we collect your Email Address and a hashed Password for authentication (JWT).

### C. Analytics & Crash Reporting
- **Crash Reporting**: We use Sentry to detect application crashes. This collects non-identifiable device information (OS version, device model, stack traces) to help us fix bugs. Sentry is configured to scrub personally identifiable information.
- **Monitoring**: We do not use third-party marketing trackers (e.g., Facebook Pixel, Google Analytics) inside the mobile application.

## 3. Data Retention, Backups & Deletion
- **Retention**: We retain your synced data as long as your account is active.
- **Backups (Future Capability)**: In our future production deployment, encrypted daily database snapshots will be retained for 14-30 days to prevent catastrophic data loss.
- **Account Deletion**: You can request complete account deletion at any time via the in-app Settings menu or by contacting support. Upon deletion, all cloud data is permanently destroyed. You must manually uninstall the app to delete local device data.

## 4. Third-Party Sharing
We share data with third parties **only** for the core functioning of the app:
- **Hosting**: Our backend infrastructure (e.g., AWS/Render).
- **Error Tracking**: Sentry (anonymized crash logs).
- **Push Notifications**: Apple APNs and Firebase Cloud Messaging (FCM) strictly for delivering reminders you explicitly enable.

## 5. Your Rights
Under GDPR and CCPA, you have the right to access, rectify, or erase your personal data. Contact us at the email below to exercise these rights.

## 6. Contact Us
For privacy inquiries, please contact: `support@lifeos.io`
