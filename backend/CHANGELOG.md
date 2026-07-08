
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
- Integrated Writing Milestones (Entries/Words) into Unified Activities
- Optimized signals to fetch old instances more efficiently
