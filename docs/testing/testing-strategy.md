# LifeOS Testing Strategy

## Philosophy
Our goal is to build confidence that every future change can be validated automatically without slowing down developer velocity. We do not chase 100% artificial coverage. Instead, we focus on:
1. **High-risk functionality** (Authentication, Data Persistence)
2. **Reusable infrastructure** (Design System, Core Hooks)
3. **Maintainability** (Clear factories, mocked networks)
4. **Measurable quality** (Clear coverage reports per layer)

## Coverage Targets
- **Backend:** ≥80% (Focus on critical business logic, API contracts)
- **Frontend (Web):** ≥70% (Focus on shared components, hooks, auth)
- **Mobile (React Native):** ≥70% (Focus on core screens, critical flows)
- **End-to-End (Maestro):** 100% of primary user journeys (Login, Planner, Habits, Goals, Journal, Journey, Logout).

## Core Principles
- **Preserve Architecture:** Tests validate behavior, they do not dictate architecture changes unless an architectural flaw prevents testability.
- **Mock at the Boundary:** We use `MSW` for frontend and mobile network mocking to ensure tests run hermetically.
- **Factories over Fixtures:** We use `factory_boy` on the backend to dynamically generate test data rather than relying on brittle static JSON fixtures.
