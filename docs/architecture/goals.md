# Goals Architecture

The Goals module follows the canonical frontend architecture established during the Phase 10B Planner Integration. It implements a fully server-driven state management pattern, removing client-side state stores in favor of React Query for data fetching, caching, and mutation.

## Core Principles

1.  **Backend Authority**: The Django backend is the single source of truth. All calculations (e.g., progress calculation based on milestones) are performed by the backend.
2.  **React Query**: `useQuery` and `useMutation` are exclusively used to manage server state.
3.  **URL State Synchronization**: Active filters, sorting, and pagination are stored in the URL search parameters to ensure linkability and persistence across reloads.
4.  **Optimistic Updates**: Mutations (like updating progress, toggling milestones, deleting) use optimistic cache updates to ensure immediate UI feedback.
5.  **Strict Typing & DTOs**: Backend snake_case responses are mapped to camelCase frontend domain models using strict Data Transfer Objects (DTOs) and mappers.

## Directory Structure

```
src/features/goals/
├── api/
│   ├── goals.ts            # API service calls
│   ├── goals.keys.ts       # React Query Key Factory
│   ├── goals.mapper.ts     # DTO to Domain Model mappers
│   └── goals.types.ts      # TypeScript interfaces for DTOs and Payloads
└── hooks/
    ├── useGoals.ts         # Query hook for fetching paginated goals
    ├── useGoalStatistics.ts# Query hook for fetching stats
    ├── useCreateGoal.ts    # Mutation hook
    ├── useUpdateGoal.ts    # Mutation hook
    ├── useDeleteGoal.ts    # Mutation hook
    └── ...                 # Other specific mutations
```

## State Management Migration

In Phase 10C, the local Zustand-based `goalSlice` was entirely removed. The `useAppStore` no longer stores `goals`.

### Before (Phase 10A)
- Goals stored in `useAppStore.goals`
- Mutations updated Zustand state directly
- Progress calculated on frontend
- Filter state kept in React component state

### After (Phase 10C)
- Goals fetched via `useGoals()`
- Mutations dispatched via `useUpdateGoal()`, which optimistically updates the React Query cache and syncs with the backend.
- Progress calculated entirely on the backend based on `is_completed` fields of associated milestones.
- Filter and pagination state managed via URL `useSearchParams()`.

## API Layer

The API layer utilizes the central `axiosInstance`. All goals requests are routed to `/api/goals/`.

### Pagination
The module fully integrates with Django's `PageNumberPagination`, consuming `count`, `next`, and `previous` fields.

### Caching Strategy
Query invalidation occurs minimally. Specifically, creating, deleting, or updating a goal invalidates the `statistics` cache to keep dashboard numbers fresh, while list queries are optimistically updated where possible to avoid redundant refetching.
