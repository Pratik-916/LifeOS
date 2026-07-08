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
