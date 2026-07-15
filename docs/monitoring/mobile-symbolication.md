# Mobile Symbolication & Crash Reporting

React Native stack traces are compiled and minified, which makes reading raw production crashes difficult.

## JavaScript Source Maps
- Source maps must be generated during the production build step.
- Ensure that `@sentry/react-native/expo` plugin is added to `app.json`.
- Expo Application Services (EAS) automatically handles JavaScript source map generation and upload if configured correctly.

## Native Symbol Upload
- Native code crashes (Objective-C/Swift for iOS, Java/Kotlin for Android) require dSYM files (iOS) or ProGuard mapping files (Android).
- **iOS**: Ensure XCode build phase includes the Sentry symbol upload script.
- **Android**: Ensure `sentry.gradle` is applied in the `app/build.gradle`.

## CI/CD Integration
Symbol upload should be deferred to the CI/CD pipeline (e.g., fastlane or EAS Build).
- **Environment**: Set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` in your CI/CD secrets.
- **Process**: During `eas build --profile production`, the Sentry plugin automatically injects the upload scripts and uses the token to push symbols.

Failure to upload source maps will result in obfuscated stack traces in the Sentry dashboard, making debugging significantly harder.
