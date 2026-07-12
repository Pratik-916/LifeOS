# Navigation

LifeOS utilizes `@react-navigation` to manage the view hierarchy.

## Architecture
- **RootNavigator** (`src/navigation/index.tsx`): The top-level coordinator. It listens to the `useAuthStore`.
- **AuthStack**: A Native Stack navigator containing unauthenticated routes (`LoginScreen`, `RegisterScreen`). Shown if `isAuthenticated` is false.
- **BottomTabNavigator**: The core authenticated application layout featuring a tab bar mapping to LifeOS domains (Dashboard, Planner, Goals, Journal, Journey).

This configuration completely isolates authenticated domains from unauthenticated access.
