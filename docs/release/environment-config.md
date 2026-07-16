# Production Environment & Monitoring

This document details how environment secrets and third-party monitoring platforms interact with the production build.

## API Validation
By default, the EAS `production` profile hardcodes the URL `https://api.lifeos.io`.
- No development credentials or local IPs (`192.168.x.x`) are compiled into production binaries.
- The React Native bundle is minimized and stripped of debug assertions.

## Sentry Monitoring & Source Maps
To ensure Sentry can associate crashes with the exact release and provide readable stack traces, we upload source maps during the EAS build process.

**Crucially, we do not hardcode Sentry credentials in `app.json`.**

Instead, the Expo build environment dynamically relies on EAS Secrets to authenticate the `@sentry/react-native/expo` plugin:
1. `SENTRY_ORG`: Your organization slug.
2. `SENTRY_PROJECT`: Your project slug (e.g., `lifeos-mobile`).
3. `SENTRY_AUTH_TOKEN`: The secure API key granting upload privileges.

If these secrets are missing, the plugin fails gracefully without blocking the production build (though stack traces will remain obfuscated).
