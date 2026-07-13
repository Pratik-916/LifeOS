# Journal Mobile Integration

## Architecture
The Journal module is built using the established feature-first architecture in `src/features/journal`.
It implements a premium native reading and writing experience while deferring all data persistence, analytics, and AI logic to the existing Django backend.

## API Integration
The API layer relies on `axios` (configured as `apiClient`) and strictly maps backend DTOs (`JournalEntryDTO`, `JournalStatsDTO`) to frontend Domain Models (`JournalEntryModel`, `JournalStatsModel`).

- `getJournalEntries`: Paginated journal list with filtering (search, mood).
- `getJournalEntry`: Fetches a single entry by ID.
- `updateJournalEntry`: Partial updates (used by autosave).
- `createJournalEntry`: Creates new entries.
- `getJournalStatistics`: Fetches backend-calculated analytics.

## Autosave Flow
The `JournalEditorScreen` implements an 800ms debounced autosave.
When a user types, `isDirty` becomes true. After 800ms of inactivity, if an `id` exists, it triggers a `PATCH` request via React Query mutation (`updateJournalEntry`). The UI shows an `AutosaveIndicator` (Saving... -> Saved). The indicator automatically fades out gracefully 2 seconds after a successful save.

## Draft Persistence
If the user is writing a *new* entry (no ID yet) or loses network connection, the editor persists the form state to `@react-native-async-storage/async-storage` under the key `@journal_draft`.
When opening the editor to create a new entry, it first checks this storage key and hydrates the form if a draft exists. The draft is deleted upon successful creation.

## Offline Behaviour
React Query caches the list and details views, allowing users to read previously fetched journals while offline. Mutations (autosave, create) will fail and degrade gracefully to local draft persistence.

## Image Handling
The module architecture includes placeholder components (`ImageGallery`, `ImagePickerButton`) mapped to the `JournalImageDTO` contract. *Image functionality is fully deferred to a future phase*. Currently, the components render placeholders. Uploading, previewing, and fullscreen viewing are disabled pending backend endpoint stability.

## Statistics
Statistics (Writing Score, Sentiment Score, Reading Time, Streak) are never calculated natively. They are exclusively derived from `useJournalStats` and the individual entry DTOs returned by the backend's AI and analytic pipelines.

## Future AI Integration Points
The DTOs support `ai_summary`, `ai_tags`, `writing_score`, and `sentiment_score`. The UI currently displays the scores. A dedicated placeholder "AI Insights" component is present on the Details screen, explicitly marked as "Coming Soon", preparing the layout for future generative integrations without impacting current performance.

## Version
Latest Release: `v1.2.1-mobile-journal-polish`
