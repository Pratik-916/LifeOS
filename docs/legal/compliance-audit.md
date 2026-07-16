# Compliance Audit

This document assesses LifeOS's current compliance against major regulatory frameworks and store guidelines.

## 1. Google Play Developer Policies
- **User Data Policy**: Compliant. A valid Privacy Policy is drafted and an in-app Account Deletion mechanism exists.
- **Permissions Policy**: Compliant. The app only requests Internet and Notifications. No sensitive permissions (Camera, Location, Contacts) are requested.
- **Data Safety**: Compliant. Data mapping (`google-play-data-safety.md`) accurately reflects that data is encrypted in transit and optionally collected.

## 2. Apple App Store Review Guidelines
- **Guideline 5.1.1 (Data Collection & Storage)**: Compliant. The app functions entirely offline without requiring an account. Account creation is strictly an opt-in feature for synchronization.
- **Guideline 5.1.1(v) (Account Deletion)**: Compliant. The backend API supports full account and data eradication (`DELETE /api/v1/users/me/`).
- **Guideline 2.3 (Accurate Metadata)**: Compliant. The Privacy Labels (`apple-privacy-labels.md`) accurately distinguish between "Data Linked to You" and "Diagnostics".

## 3. GDPR & CCPA Principles
- **Privacy by Design**: Compliant. The app defaults to local-only SQLite storage (`AsyncStorage`). No data leaves the device unless the user explicitly registers an account to enable Sync.
- **Data Minimization**: Compliant. We only collect Email for authentication. We do not collect names, phone numbers, or dates of birth.
- **Right to Erasure (Right to be Forgotten)**: Compliant via the Account Deletion endpoint.

## 4. Remaining Compliance Gaps
- **Hosting of Legal Documents**: The drafted `privacy-policy.md` and `terms-of-service.md` must be physically hosted on a public web server (e.g., `lifeos.io`) before store submission.
- **IARC Content Rating**: The formal age-rating questionnaire must be filled out manually in the Play Console/App Store Connect. LifeOS targets a 4+ (Everyone) rating.
