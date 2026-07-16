# Release Build Verification

A systematic checklist to verify a successful production deployment.

## 1. Verification of Build Artifacts
- [ ] Ensure `release.yml` successfully completed in GitHub Actions.
- [ ] Download the Android AAB from the Expo Dashboard and ensure it matches the `versionCode`.
- [ ] Verify the iOS IPA is generated without signing errors.

## 2. Environment Verification (via QA APK)
Install the `production-apk` onto a physical device:
- [ ] Open the app and attempt to register/login.
- [ ] Monitor network traffic to guarantee it communicates strictly with `https://api.lifeos.io`.
- [ ] Disable WiFi/Cellular, perform an action (e.g., add a habit), and verify the Offline Sync Engine successfully queues it without crashing.
- [ ] Re-enable WiFi and verify successful remote mutation.
- [ ] Verify local push notifications trigger natively.

## 3. Metadata Verification
- [ ] Trigger an intentional crash (if a debug button exists) and verify Sentry successfully catches it.
- [ ] Verify Sentry translates the crash into a readable stack trace (confirming source maps uploaded).
- [ ] Verify the crash correctly associates with the Git Tag and `version`.
