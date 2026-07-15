# LifeOS Testing Checklist

## Backend Validation
- [x] Pytest configured (`pytest.ini`)
- [ ] Django API Contract tests cover core CRUD
- [ ] Factory Boy definitions created for `User`, `Task`, `Goal`, `Habit`
- [ ] Code Coverage >= 80%

## Web Validation
- [x] Vitest & JSDOM configured
- [ ] Design System components tested
- [ ] React Query hooks intercepted with MSW
- [ ] Code Coverage >= 70%

## Mobile Validation
- [x] Jest-Expo configured
- [x] MSW configured for React Native
- [ ] Navigation and Screens tested
- [ ] Code Coverage >= 70%

## End-to-End Validation
- [x] Maestro setup
- [x] 100% of Core Flows explicitly defined in YAML
