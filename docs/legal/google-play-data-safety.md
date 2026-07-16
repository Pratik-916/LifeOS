# Google Play Data Safety Questionnaire Mapping

This document maps exactly to the Google Play Console Data Safety section based on the current LifeOS architecture.

## 1. Data Collection & Security
- **Does your app collect or share any of the required user data types?** Yes.
- **Is all of the user data collected by your app encrypted in transit?** Yes (TLS/HTTPS).
- **Do you provide a way for users to request that their data be deleted?** Yes.

## 2. Data Types Collected

### Personal Info
- **Email Address**
  - Collected? Yes.
  - Shared? No.
  - Processed ephemerally? No.
  - Required or Optional? Optional (Users can use the app offline without an account).
  - Purpose: App Functionality (Account Sync).

### App Activity
- **App Interactions**
  - Collected? No (We do not track UI taps/clicks via third-party analytics).

### App Info and Performance
- **Crash Logs**
  - Collected? Yes (Via Sentry).
  - Shared? No (Only processed by our Sentry instance).
  - Required or Optional? Optional (Can be disabled if user opts out).
  - Purpose: Diagnostics.

### User Content
- **Other User Content (Journal, Tasks, Habits)**
  - Collected? Yes (If sync is enabled).
  - Shared? No.
  - Required or Optional? Optional (Strictly requires account creation).
  - Purpose: App Functionality (Cross-device sync).

## 3. Data Sharing
LifeOS does **not** share data with external third parties for advertising or tracking purposes. Data is only transferred to our proprietary backend (and Sentry for errors).
