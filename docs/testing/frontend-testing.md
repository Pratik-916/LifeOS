# Frontend Testing (React / Vite)

## Frameworks
- `vitest`, `@testing-library/react`, `msw`

## Folder Structure
```
frontend/src/
  __tests__/
    setup.ts
    mocks/
    components/
    hooks/
    pages/
```

## Writing Tests
1. **MSW**: All network requests must be intercepted by MSW handlers defined in `__tests__/mocks/handlers.ts`.
2. **Components**: Test interactions (clicks, typing) rather than implementation details (state). Use `@testing-library/user-event`.
3. **Providers**: Wrap tested components in the required providers (Theme, QueryClient, Router) using a custom `render` wrapper.

## Running Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage
```
