# Journey Mobile Integration

## Overview
The Journey module allows users to track their memories, major milestones, and timeline events in the React Native application. This module integrates exclusively with the Django backend as the single source of truth, avoiding any duplicated business logic or calculations in the mobile client.

## Architecture

Following the Feature-First Architecture pattern established in Planner, Habits, Journal, and Goals:
- **API Layer**: `src/features/journey/api/` contains `journey.ts`, `journey.types.ts`, `journey.keys.ts`, and `journey.mapper.ts`. All Django DTOs and backend endpoints (`/api/v1/journey/memories/`) are mirrored here.
- **State Management**: Server state is managed exclusively by **React Query**. UI state is local to components. No global Zustand stores are used except for implicit caching by `AsyncStorage`.
- **Navigation**: Integrated cleanly into the `BottomTabNavigator` with nested stack screens (`MemoryDetailsScreen`, `MemoryEditorScreen`, `MemorySearchScreen`, `JourneyStatisticsScreen`) in the `MainStack`.

## Draft Persistence
When a user begins editing a memory, the autosave feature captures the `react-hook-form` state (debounced at 1 second) and saves it to `AsyncStorage` using the key `@journey_memory_draft`. 
- **Restoration**: Occurs seamlessly upon mounting `MemoryEditorScreen` if there is no pre-existing memory ID (i.e. creating a new memory).
- **Clearing**: The draft clears automatically when a save/create API call successfully executes.

## Timeline Grouping
The backend `TimelineService` processes memories and activities and serves them as grouped items (Year -> Month -> Events). The `useJourneyTimeline` hook leverages `useInfiniteQuery` with React Query to fetch these sequentially via infinite pagination offset, and `JourneyScreen`'s `SectionList` displays this continuous narrative seamlessly.

## Offline Behaviour
- Cached memories from React Query can be viewed while offline.
- Mutations are paused or disabled offline.
- Draft persistence runs locally, so if the app is closed while offline, unsaved editor drafts remain intact.

## Performance
- Rendering optimization achieved using standard `FlatList` and `SectionList` components.
- Direct pass-through mapping from backend grouped timelines to the frontend prevents heavy local transformations or recalculations.

## Future Image Support
The architecture implements a placeholder `MemoryImageCarousel` in the UI to demonstrate how multiple memory photos will be presented. The API types already support an array of `MemoryImage` objects, and the layout supports expanding images seamlessly when native device capabilities (Camera / Gallery API integrations) are approved for integration.
