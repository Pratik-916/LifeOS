# Version Management Strategy

LifeOS uses standard Semantic Versioning (`MAJOR.MINOR.PATCH`).

## Centralized Version Bumper
A centralized script located at `scripts/bump-version.js` manages version synchronization.

### Usage
```bash
node scripts/bump-version.js 1.27.0
```

### Affected Files
1. `package.json` (Root Workspace)
2. `frontend/package.json`
3. `mobile/package.json`
4. `mobile/app.json`: Updates the semantic version, and automatically computes an integer `versionCode` (Android) and `buildNumber` (iOS) based on the semantic structure.
5. `backend/VERSION.txt`: A simple text file serving as the backend's source of truth.

## Tagging and Releases
After bumping the version locally, commit and tag:
```bash
git add .
git commit -m "chore(release): v1.27.0"
git tag v1.27.0
git push origin main --tags
```
Pushing the tag natively invokes the `release.yml` GitHub action.
