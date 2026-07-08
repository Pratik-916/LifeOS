
## [v1.3.0] - Planner Module
- Implemented Tag model
- Implemented Task and SubTask models
- Added TaskActivity for action history
- Added soft delete logic
- Implemented robust stats calculations
- Wired nested serializer relationships
- Swagger endpoint fixes and tests

## [v1.4.0] - Goals Module
- Unified Activity Model
- Extracted Core Models
- Implemented Goals and Milestones
- Added Planner to Goal linking
- Automated Progress and Status Logic
- Bulk Operations

## [v1.5.0] - Habits Module
- Implemented Habit, HabitLog, and HabitReminder models
- Built Timezone-aware streak calculators for Daily/Weekly/Monthly cycles
- Extracted complex logic into new \services/\ tier
- Integrated Unified Activities for streaks and habit completions
- Exposed advanced habit statistics endpoint for Dashboards

## [v1.6.0] - Journal Module
- Implemented JournalEntry and JournalImage models
- Added comprehensive Reflection fields and AI stubs
- Implemented JournalService, JournalStatisticsService, and JournalAIService
- Automated reading time and word count calculations via signals
## [v1.7.0] - Journey Module
- Implemented Memory and MemoryImage models
- Created the central Timeline Service aggregation engine merging Activities and Memories
- Built robust Journey Statistics reporting metrics across the entire application
- Hooked memory lifecycle into Unified Activities
- Created journey endpoints with filtering and pagination
- Established AI interface stubs for future memory highlighting and summarization

## [v1.8.0] - Analytics Module
- Added pure READ Analytics Module without any models or database tables
- Configured robust DTO layer for strong type-checking responses
- Created 13 read-optimized endpoints supporting filtering and charts
- Added deep PostgreSQL aggregations across all previous modules
- Designed and implemented InsightService facade for future AI consumption
- Implemented weighted Productivity Score and rule-based Burnout Indicator
- Built TrendService for computing growth and momentum metrics

## [v1.9.0] - Blog CMS Module
- Created `blog` app with `BlogPost`, `BlogCategory`, and `BlogImage` models
- Integrated `TimeStampedModel`, `SoftDeleteModel`, and `OptimisticLockModel` abstractions
- Separated API boundaries: Admin (UUID-based routing) vs Public (Slug-based routing)
- Configured Content Service for dynamic SEO validation, word count, and excerpt generation
- Prepared Search Service as a bridge for future PostgreSQL `SearchVector` implementation
- Tracked blog lifecycle natively inside Unified Activities feed
- Built PostgreSQL statistical aggregations for charting output
