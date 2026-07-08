# Planner Architecture

The Planner module is the canonical reference implementation for all frontend features in LifeOS.

## Folder Structure
```text
src/features/planner/
├── api/             # API calls (planner.ts), DTO Mappers, Query Keys, Types
├── components/      # UI components specific to Planner (TaskCard, TaskModal)
├── hooks/           # React Query hooks (useTasks, useCompleteTask, etc.)
└── pages/           # High-level route pages (Planner.tsx)
```

## State Ownership
- **Server State:** Handled entirely by React Query hooks in `hooks/`.
- **UI State:** Handled by local state (`useState`) or Zustand (`usePlannerStore`) for transient data like Modal visibility.

## React Query & Optimistic Updates
- **Cache Strategy:** `useTasks` has a 30s stale time and 5m GC time.
- **Optimistic Updates:** Mutations (`useCompleteTask`, `useUpdateTask`, `useDeleteTask`) implement `onMutate` to snapshot the cache, apply the change optimistically, and rollback `onError`.
- **Query Keys:** Mutations invalidate specific scopes (e.g., `plannerKeys.lists()`), avoiding `plannerKeys.all()` to prevent unnecessary refetches.
- **Delete UX:** Deletions are optimistic and display a 5-second "Undo" toast. If undone, a silent restore mutation is fired.

## Pagination
List views utilize the generic `Pagination.tsx` component and support backend sorting (`sort_by`, `sort_order`). React Query's `prefetchQuery` is utilized to load the next page preemptively.

## Known Limitations
- Cursor-based pagination is not yet implemented (currently using page offsets).
- Complex recurring task rules are handled loosely in the frontend.
