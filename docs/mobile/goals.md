# Goals Mobile Integration

## Architecture
The Goals mobile module strictly follows a feature-first architecture, located at `mobile/src/features/goals/`. 
It completely relies on the Django backend as the single source of truth for calculations, completion rates, and statistics. No business logic (e.g. progress percentage calculation) is duplicated on the mobile client.

## API Integration
The API layer maps the existing `GoalDTO` and `MilestoneDTO` formats used by the web frontend directly to the mobile domain models.
- `useGoals`: Handles paginated fetching and caching.
- `useGoal`: Handles individual goal fetching.
- `useGoalMutations`: Centralizes all state mutations (Create, Update, Delete, Archive, Restore, Favorite) and query invalidations. 

## Milestone Flow
Milestones are handled via a nested array inside the Goal payload (`CreateGoalPayload` / `UpdateGoalPayload`). 
The `GoalEditorScreen` maintains a local state array of milestones which are synced with the backend upon `Save`. 
In the `GoalDetailsScreen`, tapping a milestone triggers an immediate optimistic update where the `milestones` array is patched and sent to the backend.

## Offline Behaviour
- The module leverages React Query's cache to display previously loaded goals when offline.
- A `NetworkOfflineBanner` is displayed at the top of the dashboard.
- Mutations are currently disabled/fail gracefully when offline.
- The `GoalEditorScreen` autosaves forms locally using `AsyncStorage` under `@goal_draft`, preventing data loss if the app crashes or connectivity is lost during creation.

## Progress Lifecycle
1. The user checks off a Milestone in the UI.
2. The UI fires a `PATCH` request to the goal containing the modified milestone.
3. The Django backend recalculates the overarching goal's completion percentage.
4. The frontend invalidates its cache and visually animates the `GoalProgressBar` to the newly calculated percentage.
5. If the backend returns `progress == 100`, a UI celebration is triggered (planned integration).

## Future Roadmap
- Implementation of AI smart coaching insights on the `GoalDetailsScreen`.
- Advanced drag-and-drop ordering for Milestones if supported directly via independent backend endpoints.
- Granular offline synchronization queue for mutations.
