# Journey Mobile Module

The Journey module provides a premium timeline view of user memories, allowing them to capture, revisit, and celebrate significant moments.

## Architecture

The mobile implementation rigorously adheres to the feature-first architecture, avoiding any duplication of the Django backend's business logic.
- **Backend as Single Source of Truth**: The Django backend is exclusively responsible for structuring the timeline (grouping by Year and Month) and aggregating all statistics.
- **Domain Models**: Data flows from backend JSON responses through `journey.mapper.ts` where it is converted into strict domain models (e.g., `TimelineEventModel`, `MemoryModel`).
- **State Management**: Uses `React Query` with optimistic updates for frequent interactions like Favoriting and Pinning.

## Key Screens
- **JourneyScreen**: The main entry point featuring a `SectionList` derived from the backend's `TimelineYearDTO` paginated response. Displays `MemoryCards` organized under `YearHeader` and `MonthHeader`.
- **MemoryDetailsScreen**: A rich, distraction-free reading experience displaying a full memory with full-bleed imagery, tags, metadata, and description.
- **MemoryEditorScreen**: A functional form built using `react-hook-form` to construct memory payloads, complete with automatic Draft persistence in `AsyncStorage`.
- **MemorySearchScreen**: An isolated search environment featuring a 500ms debounced backend search query for instantaneous lookups.

## Draft Persistence

The `MemoryEditorScreen` automatically serializes form state into `AsyncStorage` under a unique key based on the memory ID (or "new"). When the screen mounts, it prioritizes loading this draft. The draft is only cleared upon successful mutation (creation/update).

## Future Roadmap

- **Full Image Support**: While the architecture is prepared for `react-native-image-picker` and `multipart/form-data` uploads, the current module utilizes placeholder UI for images pending stabilization of the backend media upload endpoints.
- **Video Memories**: Expanding the timeline to support embedded video playbacks.
- **Interactive Statistics**: Providing detailed charting and filtering based on the data exposed by `useJourneyStatistics`.
