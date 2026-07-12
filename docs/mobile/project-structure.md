# Project Structure

The LifeOS mobile application strictly adheres to a feature-first architecture that mirrors the existing React web client. This minimizes cognitive overhead for full-stack developers switching between web and mobile environments.

## Directory Layout
`mobile/src/`
- `api/`: Centralized networking logic, Axios configurations, and interceptors.
- `components/`: Pure, un-opinionated UI primitives (e.g., Button, Card, Input).
- `features/`: Domain-specific business logic and screens grouped by feature (e.g., auth, dashboard).
- `navigation/`: React Navigation stacks and tab coordinators.
- `store/`: Zustand global state slices.
- `theme/`: Global aesthetic configurations (Tailwind/NativeWind).
- `types/`: Global TypeScript interfaces.
- `utils/`: Pure helper functions.
