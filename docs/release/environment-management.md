# Environment Management

LifeOS strictly validates required environment variables across all three stacks to ensure zero runtime misconfigurations during deployment.

## Environment Validation Script
The `scripts/validate-env.js` utility is executed during the CI pipelines before any builds commence. It reads from both injected `process.env` (GitHub Secrets) and local `.env` files. If any required variable is missing, the build fails immediately.

## Required Variables
### Backend
- `DJANGO_SECRET_KEY`: Cryptographic signing key.
- `DEBUG`: Must explicitly evaluate to `False` in production.

### Frontend
- `VITE_API_URL`: The fully qualified URL pointing to the production Django REST Framework.

### Mobile
- `EXPO_PUBLIC_API_URL`: The URL injected into the React Native bundle at build time by Expo EAS.

## CI Secrets
GitHub Actions uses the following GitHub Repository Secrets:
- `EXPO_TOKEN`: Grants the `release.yml` permission to trigger cloud builds via EAS.
- `DJANGO_SECRET_KEY`: Injected into the backend CI for deploy checks.
