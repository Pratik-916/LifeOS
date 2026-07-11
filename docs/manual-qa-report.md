# LifeOS Manual QA Report

**Testing Methodology**: End-to-End Real User UI Testing
**Tester**: `browser` Subagent (QA Automation Engineer)
**Date**: 2026-07-09

## Application Health
**Overall Score: 40 / 100 (FAIL)**
**Status**: NOT Production Ready

The application suffers from critical API routing configuration mismatches on the frontend that break core CRUD operations in multiple modules. UI buttons are missing in the Journey module, and Timers are completely non-functional in the Planner.

---

## Testing Results Summary

- **Modules Tested**: 7
- **PASS Count**: 2 (Journal, Analytics)
- **FAIL Count**: 5 (Planner, Goals, Habits, Journey, Blog)
- **Blocked Features**: Blog CMS (missing UI controls)

---

## Detailed Failure Reporting

### 1. Planner
- **Feature**: Timers (Pomodoro, Stopwatch, etc.)
- **Severity**: Major
- **Steps to reproduce**: Navigate to Planner > Click "Play" on Focus timer.
- **Expected behaviour**: Timer ticks down, UI updates every second.
- **Actual behaviour**: The timer does not tick. It is frozen at "25:00".
- **Root cause**: The timer is currently only a static UI mock using a boolean toggle. No actual time-keeping logic exists.
- **Suggested fix**: Implement a `PlannerTimers.tsx` component using `setInterval` or `useInterval`.

### 2. Goals
- **Feature**: Create Goal
- **Severity**: Critical
- **Steps to reproduce**: Navigate to Goals > Click "New Goal" > Fill out form > Submit.
- **Expected behaviour**: Goal is created and added to the list.
- **Actual behaviour**: Form does not close. Goal is not added.
- **Root cause**: Frontend API requests `POST /api/v1/goals/` which returns `405 Method Not Allowed`. (Like the Journal bug, the frontend is hitting the base router root instead of the specific endpoint e.g., `/api/v1/goals/goals/`).
- **Suggested fix**: Update `src/features/goals/api/goals.ts` endpoints.

### 3. Habits
- **Feature**: Create Habit
- **Severity**: Critical
- **Steps to reproduce**: Navigate to Habits > Click "New Habit" > Fill out form > Submit.
- **Expected behaviour**: Habit is created.
- **Actual behaviour**: Modal closes but list shows "No habits found".
- **Root cause**: Frontend API requests `POST /api/v1/habits/` which returns `405 Method Not Allowed` for the exact same routing reason as Goals.
- **Suggested fix**: Update `src/features/habits/api/habits.ts` endpoints.

### 4. Journey
- **Feature**: Memory Actions (Favorite, Pin, Delete)
- **Severity**: Major
- **Steps to reproduce**: Navigate to Journey > Create Memory > Attempt to Favorite/Pin/Delete.
- **Expected behaviour**: UI buttons are available to perform these actions.
- **Actual behaviour**: Memory is successfully created, but there are absolutely no buttons or context menus to interact with the memory item.
- **Root cause**: The Journey UI components (`TimelineMonth.tsx` or similar) do not render the action buttons.
- **Suggested fix**: Add a dropdown menu or hover icons to Journey memory cards.

### 5. Blog
- **Feature**: CMS Admin & Draft Creation
- **Severity**: Critical
- **Steps to reproduce**: Navigate to Blog.
- **Expected behaviour**: A "New Post" button exists, and the post list loads.
- **Actual behaviour**: No button exists to create a draft. The page crashes/errors with `Cannot read properties of undefined (reading 'map')`.
- **Root cause**: The frontend API requests `GET /api/v1/posts/` which returns `404 Not Found` (should be `/api/v1/blog/posts/`), causing data to be undefined and crashing the list render.
- **Suggested fix**: Update `src/features/blog/api/blog.ts` endpoints to include the `/blog/` prefix and add the "Create Draft" button to the UI.

---

## Recommendations
1. **API Audit Pass**: Immediately fix the `/api/v1/goals/`, `/api/v1/habits/`, and `/api/v1/posts/` API endpoints in the frontend Axios calls. This is the exact same bug that broke the Journal.
2. **Planner Stabilization (Phase 11.5A.1)**: Proceed with the previously approved implementation plan to build the Timer functionality.
3. **UI Completeness**: Add the missing action buttons to the Journey module and the Blog module.

**Conclusion**: Do not release. Execute targeted fixes for the critical API mismatches before proceeding further.
