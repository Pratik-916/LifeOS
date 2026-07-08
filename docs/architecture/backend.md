# Backend Architecture

## Tech Stack
- **Framework:** Django 5.1 + Django REST Framework
- **Language:** Python
- **Database:** SQLite (Development)
- **Authentication:** SimpleJWT (JWT Tokens)

## Core Principles
1. **Modular Apps:** The backend is split into independent apps (`apps/core`, `apps/users`, `apps/planner`, `apps/goals`, `apps/habits`) to mirror the frontend features.
2. **Soft Deletion:** Core entities inherit from `SoftDeleteModel` (providing `deleted_at`) to ensure data is never truly lost and allows for restore/undo functionality.
3. **Standardized Responses:** All APIs return a consistent JSON wrapper: `{ success: bool, data: dict|list, message?: str, error?: dict }`. This is handled by a custom `JSONRenderer` and Exception Handler.
4. **Pagination & Sorting:** Django Filters and DRF Pagination handle server-side sorting and pagination natively to keep payloads small and responsive.
