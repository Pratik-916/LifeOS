# Testing Strategy

## Backend Testing
- We use the standard Django `TestCase`.
- Run tests via `python manage.py test`.
- Aim for high coverage on API endpoints and core business logic.

## Frontend Testing
- *Note:* Frontend automated tests via Vitest/Jest are currently pending integration.
- Once configured, they will be executable via `npm test`.
- Focus will be on unit-testing React Query hooks, Zustand stores, and utility functions.
