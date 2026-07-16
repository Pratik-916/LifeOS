# Android Release Engineering

## Identifiers
- **Application ID (Package Name)**: `com.lifeos.mobile` (Determines the Google Play URL).
- **Version Name**: Derived from `app.json` `version` (e.g., `1.28.0`). Visible to the user.
- **Version Code**: An internal integer derived logically (`12800`). It MUST strictly increment with every release to prevent downgrades.

## EAS Profiles
We rely on two Android EAS Profiles defined in `eas.json`:
1. **production**: The default. Triggers an `.aab` output.
2. **production-apk**: Extends `production` but explicitly sets `buildType: apk`.

## Generating Builds Manually
To trigger an AAB build locally (requires Expo account):
```bash
eas build --platform android --profile production
```

To trigger a QA APK locally:
```bash
eas build --platform android --profile production-apk
```
