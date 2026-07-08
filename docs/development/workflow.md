# Development Workflow

## Branching Strategy
We use standard Git flow principles:
- `main`: The production-ready branch.
- `feature/*`: For all new capabilities.
- `fix/*`: For bug fixes.
- `chore/*`: For infrastructure, CI, or dependency updates.

## Commit Conventions
We follow Conventional Commits:
- `feat: [description]` for new features.
- `fix: [description]` for bug fixes.
- `refactor: [description]` for code changes that neither fix a bug nor add a feature.
- `chore: [description]` for maintenance tasks.

## Pull Requests
All changes must go through a Pull Request. PRs must pass the CI pipeline before merging.
