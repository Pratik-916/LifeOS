# Build Pipeline

## Local Validation
All builds can be locally validated using the unified root `Makefile`:
```bash
make build
```

## Backend Build
The backend is a Django application. Its "build" step in CI involves:
1. Validating static asset collection (`python manage.py collectstatic`).
2. Ensuring no deployment security misconfigurations (`python manage.py check --deploy`).

## Frontend Build
The frontend is built using Vite (`npm run build`). This compiles the React application into a standalone `dist/` directory consisting of optimized HTML, CSS, and JS.

## Mobile Build (Expo EAS)
We use Expo Application Services (EAS) for mobile builds.
Configuration is managed in `mobile/eas.json`.
- **development**: Generates internal debug builds.
- **preview**: Generates internal staging builds.
- **production**: Triggers app store ready APK, AAB, and iOS Archives.

In CI, the `release.yml` uses the `EXPO_TOKEN` secret to securely trigger cloud EAS builds without requiring heavy local Android Studio or Xcode instances on the GitHub runner.
