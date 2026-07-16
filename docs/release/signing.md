# Release Signing & Secret Management

Zero trust and strict separation of concerns define our signing strategy. **No cryptographic material exists in this repository.**

## 1. Android Keystore
- Android apps require a `.jks` or `.keystore` file to securely prove identity to the Google Play Store.
- LifeOS utilizes **Expo Managed Credentials**. EAS generates and guards the Android Keystore in the cloud.
- To export the keystore for manual backup (requires explicit authentication):
  ```bash
  eas credentials
  ```

## 2. Apple Certificates & Provisioning Profiles
- iOS requires a complex web of Distribution Certificates, Provisioning Profiles, and App Store Connect API keys.
- LifeOS utilizes EAS to auto-manage these credentials by logging into Apple Developer via the CLI securely. EAS caches these certificates in its secure vault.

## 3. GitHub Secrets
- GitHub workflows (e.g., `release.yml`) ONLY hold the `EXPO_TOKEN`. This token acts as a scoped proxy, granting GitHub Actions the right to request a build from EAS. GitHub never sees the underlying Keystores or Apple Certificates.

## 4. EAS Secrets
- Environment configurations (like `SENTRY_AUTH_TOKEN` or Production API keys) are strictly managed via the Expo EAS Dashboard. They are injected into the build container ephemerally and never persisted.
