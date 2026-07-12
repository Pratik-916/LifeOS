# Mobile Coding Standards

## 1. Folder Structure
- **feature-first:** Group files by feature (`src/features/auth/`), not by type.
- Keep `src/components/ui/` restricted to pure, generic primitives (e.g. `Button`, `Input`).
- API configurations belong exclusively in `src/api/`.

## 2. Naming Conventions
- **Components:** PascalCase (`DashboardScreen.tsx`, `Button.tsx`).
- **Hooks:** camelCase prefixed with `use` (`useNetworkStatus.ts`).
- **Files:** camelCase for utilities (`formatDate.ts`, `errors.ts`).
- **Interfaces/Types:** PascalCase (`UserProfile`, `ApiError`). Do not prefix with `I`.

## 3. Component Rules
- Always use functional components.
- Favor `NativeWind` class names over `StyleSheet.create` unless dealing with complex animated styles.
- Extract complex UI state into a local custom hook (e.g., `useDashboardState()`).

## 4. Hook Conventions
- Keep side-effects (`useEffect`) to a minimum.
- For backend data fetching, always use `@tanstack/react-query`. Never use `useEffect` + `useState` for API calls.

## 5. React Query Patterns
- Standardize Query Keys. Example: `['user', 'profile']`, `['habits', 'list']`.
- Keep queries inside custom hooks if reused (e.g. `export const useHabits = () => useQuery(...)`).

## 6. Zustand Responsibilities
- Zustand is strictly for **Global Client State** (Auth tokens, Theme preferences, UI Sidebar toggles).
- Do NOT cache backend API data in Zustand.

## 7. Navigation Rules
- Restrict navigation actions to screens/containers. Do not pass `navigation` props deeply into nested components. Use `useNavigation()` if absolutely necessary.

## 8. Import Ordering
1. React / React Native built-ins
2. Third-party packages (`expo`, `@react-navigation`, `@tanstack/react-query`)
3. Internal Aliases/Absolute paths (Hooks, Context, Store)
4. UI Components
5. Types and Utils

## 9. Shared Contracts Strategy
- Do NOT create a monorepo for shared DTOs at this early stage to prevent over-engineering.
- Maintain type consistency by mirroring backend Django serializers manually inside `src/types/`.
- If type duplication becomes a bottleneck in the future, extract shared schemas into a `@lifeos/shared` package.
