# Release Process

This document outlines the standard operating procedure for creating a production release of LifeOS.

## 1. Local Validation
Ensure your code is thoroughly tested:
```bash
make test
make lint
make typecheck
```

## 2. Version Bump
Run the centralized version script to securely synchronize the version across all manifests and the EAS configuration:
```bash
node scripts/bump-version.js 1.27.0
```

## 3. Git Tagging & CI Trigger
Commit the bumped version manifests, tag the release, and push:
```bash
git add .
git commit -m "chore(release): v1.27.0"
git tag v1.27.0
git push origin main --tags
```

## 4. GitHub Actions Release Workflow
By pushing a tag matching `v*.*.*`, GitHub Actions automatically orchestrates the release:
1. **Validation**: Triggers `ci.yml` to re-run all tests and linting.
2. **Frontend Build**: Builds the Vite application and archives the assets.
3. **Mobile Build**: Submits Android and iOS builds to Expo EAS cloud builders.
4. **Changelog Generation**: Generates automated release notes using PR titles and publishes a GitHub Release containing all source code and built artifacts.

## Rollback Strategy
If a critical production error occurs:
- **Web/Backend**: Revert the `main` branch to the previous stable tag and re-tag (e.g., `v1.27.1`) to trigger an immediate hotfix deployment.
- **Mobile**: Utilize Expo OTA (Over-The-Air) updates if EAS Update is configured, or rollback via the Google Play Console / App Store Connect interfaces.
