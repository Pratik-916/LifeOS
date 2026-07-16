# GitHub Actions Architecture

Our workflows are defined in `.github/workflows/` and strictly split by domain.

## Workflows
1. `ci.yml`: The main orchestrator that runs on PRs and pushes to `main`. It calls the other domain workflows and runs the `security-audit` step (`npm audit`).
2. `backend.yml`: 
   - Caches `pip`.
   - Runs `ruff`, `black`, `pytest`, and `manage.py check --deploy`.
3. `frontend.yml`:
   - Caches `npm`.
   - Runs `oxlint`/`eslint`, `prettier`, `tsc`, `vitest`, and a dry-run `vite build`.
4. `mobile.yml`:
   - Caches `npm` and sets up Expo.
   - Runs `eslint`, `prettier`, `tsc`, and `jest`.
5. `release.yml`:
   - Runs exclusively on tags (`v*.*.*`) or manual dispatch.
   - Requires the CI suite to pass first.
   - Triggers `eas build` for Mobile.
   - Builds Frontend.
   - Generates a GitHub Release with auto-generated changelogs.
