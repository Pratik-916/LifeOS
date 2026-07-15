# Mobile Testing (React Native / Expo)

## Frameworks
- `jest-expo`, `@testing-library/react-native`, `msw`

## Folder Structure
```
mobile/src/
  __tests__/
    setup.ts
    mocks/
    components/
    screens/
    navigation/
```

## Writing Tests
1. **Mocking Native Modules**: Expo heavily relies on native modules. Ensure `setup.ts` correctly mocks libraries like `react-native-reanimated` and `nativewind`.
2. **Accessibility**: Test for `accessibilityLabel` and `accessibilityRole`. React Native Testing Library encourages querying by accessible roles.
3. **MSW**: We share the MSW philosophy from the web frontend to mock network boundaries.

## Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```
