# Project Structure

The LifeOS mobile application strictly adheres to a feature-first architecture that mirrors the existing React web client. This minimizes cognitive overhead for full-stack developers switching between web and mobile environments.

## Directory Layout
`mobile/src/`
- `api/`: Centralized networking logic, Axios configurations, and interceptors.
- `components/ui/`: Pure, generic UI primitives (e.g., Button, Input, ErrorBoundary).
- `config/`: Environment schemas and config objects mapping EXPO_PUBLIC_* variables.
- `features/`: Domain-specific business logic and screens grouped by feature (e.g., auth, dashboard).
- `hooks/`: Reusable global React hooks (e.g. useNetworkStatus).
- `navigation/`: React Navigation stacks and tab coordinators.
- `services/`: Third-party integration abstractions (permissions).
- `store/`: Zustand global state slices.
- `theme/`: Global aesthetic configurations (Colors, Spacing, Typography).
