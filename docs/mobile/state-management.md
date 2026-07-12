# State Management

State in LifeOS mobile is bifurcated based on data ownership:

## Remote State
Owned by the backend and cached by `@tanstack/react-query`.
- Handled at the feature/screen level.
- Handles automated retries, caching (5 min stale time default), and loading states.
- Follows identical query keys as the web client (e.g., `['dashboard', 'summary']`).

## Local/Global State
Owned by the client and managed by `zustand`.
- Restricted entirely to UI state (e.g., theme toggle, sidebar expansion).
- `useAuthStore` exclusively manages the presence and lifecycle of JWT tokens, interfacing directly with `expo-secure-store`.
