# iOS Release Engineering

## Identifiers
- **Bundle Identifier**: `com.lifeos.mobile` (The unique identifier mapping the app to App Store Connect).
- **Version**: Derived from `app.json` `version` (e.g., `1.28.0`).
- **Build Number**: Derived from `app.json` `ios.buildNumber`. Used sequentially for TestFlight iterations.

## Capabilities & Entitlements
LifeOS requires background execution capabilities for Push Notifications and Offline Sync tasks. These are securely mapped via Expo plugins natively during the pre-build phase in the cloud. No manual XCode configuration is required.

## EAS Profiles
The standard `production` profile in `eas.json` is configured to output an `.ipa` archive securely.

## Generating Builds Manually
```bash
eas build --platform ios --profile production
```
