# Production Builds Architecture

LifeOS leverages Expo Application Services (EAS) to orchestrate and manage production artifacts.

## Overview
- **AAB (Android App Bundle)**: The default production artifact for Android. It optimizes the binary size per device and is strictly required by the Google Play Store.
- **APK (Android Package Kit)**: An alternative artifact generated exclusively for local QA side-loading and automated device farms.
- **IPA (iOS App Store Package)**: The standard archive generated for Apple TestFlight and the App Store.

## Process
1. GitHub Actions detects a release tag (`v1.28.0`).
2. `release.yml` triggers `eas build`.
3. Expo cloud builders securely fetch the source code, apply the correct `EXPO_PUBLIC_*` environment variables, perform the build (including running React Native Metro bundler in production mode).
4. Sentry intercepts the build phase, automatically uploading sourcemaps.
5. EAS securely signs the final binary.
6. The artifacts are available via the Expo dashboard or auto-submitted to stores via `eas submit`.
