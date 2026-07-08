# LifeOS Backend

This is the backend for LifeOS, a personal productivity and journaling platform.

## Architecture
- **Framework**: Django 5.0+ & Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) via SimpleJWT
- **API Documentation**: OpenAPI / Swagger (`drf-spectacular`)

## Setup Instructions

### 1. Prerequisites
- Python 3.13+
- PostgreSQL Server

### 2. Virtual Environment
```bash
python -m venv .venv
.\.venv\Scripts\activate   # Windows
source .venv/bin/activate  # macOS/Linux
```

### 3. Install Dependencies
```bash
pip install -r requirements/base.txt
```

### 4. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=postgres://username:password@localhost:5432/lifeos
DJANGO_SETTINGS_MODULE=config.settings.development
```

### 5. Database Setup
Ensure PostgreSQL is running and the database `lifeos` is created.
```bash
python manage.py migrate
```

### 6. Run Server
```bash
python manage.py runserver
```

## API Documentation
Once the server is running, you can access the Swagger UI documentation at:
- `http://localhost:8000/api/schema/swagger-ui/`

## Phase 2: Authentication
- **Custom User Model**: UUIDs, email authentication.
- **JWT**: SimpleJWT with rotation and blacklisting.
- **Throttles**: Brute force protection enabled.

## Phase 3: Planner
- **Task & SubTask Management**: Full CRUD with nested structures.
- **Many-to-Many Tags**: Shared tagging system across modules.
- **Soft Delete**: Tasks are never fully deleted unless explicitly cleared, supporting full restore functionality.
- **Activity Tracking**: Real-time signal tracking for all task modifications.
- **Advanced Statistics**: Analytics endpoint powered by aggregate queryset metrics and timezone-aware calculations.

## Phase 4: Goals
- **Goals & Milestones**: Complex goal tracking with automated progress calculation based on nested milestones.
- **Unified Activity Stream**: Replaced siloed activity models with a central GenericForeignKey Activity model.
- **Planner Integration**: Tasks can now be linked directly to Goals via foreign key.
- **Bulk Operations**: Added bulk complete, archive, and delete operations.

## Phase 5: Habits
- **Habits Tracking**: Track habits dynamically across Daily, Weekly, and Monthly frequencies.
- **Smart Streaks**: Timezone-aware streak calculation engines using ISO-calendar constraints.
- **Services Layer**: Advanced business logic extracted into highly testable \services/\ modules.
- **Habit Logs**: Comprehensive tracking with mood, duration, and metrics mapping.

## Phase 6: Journal
- **Rich Journaling**: Track entries, mood, energy levels, and comprehensive reflections.
- **Automated Metrics**: Background calculation of word counts, reading times, and writing streaks.
- **AI Readiness**: Architectural stubs built for sentiment analysis, auto-tagging, and summarization.
- **Milestone Engine**: Gamification hooks into Unified Activities for 1K+ words and continuous writing streaks.

## Phase 7: Journey
- **Memories**: Create standalone manual memory moments with multiple images, categories, and unified tagging.
- **Timeline Engine**: The single canonical timeline for LifeOS, aggregating dynamic records across Planner, Goals, Habits, Journal via the Unified Activities feed natively merged with manual Memories.
- **Analytics Ready**: Comprehensive aggregation statistics returning stats covering total app engagement over time.
- **Scalable Architecture**: Strict adherence to Service-layer architectural standards with ViewSets purely orchestrating data.

## Phase 8: Analytics
- **Intelligence Engine**: A powerful READ-only analytics module built with Deep PostgreSQL aggregations.
- **Insights Facade**: `InsightsService` layer providing a single source of truth for the Dashboard and future AI, preventing recalculations.
- **Productivity & Burnout**: Generates weighted productivity scores and detects burnout loads using centralized constants.
- **Chart Ready**: Returns DTO structures optimized for charting (Line, Pie, Radar, Heatmaps) natively from the backend.
