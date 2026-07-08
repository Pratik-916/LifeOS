# Project Structure

## High-Level Layout
- `backend/`: Django application.
- `frontend/`: React + Vite application.
- `docs/`: Architecture and development documentation.

## Frontend Directory Structure (`src/`)
- `components/`: Generic, cross-feature UI components (e.g., Buttons, Layouts).
- `contexts/`: React Context providers (AuthContext).
- `features/`: The core of the application. Each directory here represents a distinct domain (Planner, Goals, Habits, etc.).
- `hooks/`: Global custom hooks (e.g., `useOfflineStatus`).
- `pages/`: Top-level routing components that stitch features together.
- `services/`: Interfaces to external systems (e.g., `notificationService`).
- `store/`: Zustand global state slices.
- `types/`: Global TypeScript interfaces.
- `utils/` or `lib/`: Shared helper functions and utility classes.

## Backend Directory Structure
- `backend/lifeos/`: The Django configuration root (settings, urls).
- `backend/apps/`: Houses all independent Django apps (`core`, `users`, `planner`, etc.).
