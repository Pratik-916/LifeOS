# Mobile API Reference

## Endpoints

### 1. Authentication (`/api/v1/auth/`)
- `POST /login/`: Accepts `username` and `password`. Returns JWT `access` and `refresh`.
- `POST /register/`: Registers a new user.
- `POST /refresh/`: Accepts a `refresh` token, returns a new `access` token.
- `POST /logout/`: Blacklists the `refresh` token.

### 2. Planner (`/api/v1/planner/`)
- `GET /tasks/`: Returns paginated task list. Supports filtering (`?status=todo`) and sorting (`?ordering=due_date`).
- `POST /tasks/`: Creates a new task.
- `GET /tasks/stats/`: Returns comprehensive dashboard statistics for tasks.

### 3. Habits (`/api/v1/habits/`)
- `GET /habits/`: Returns paginated list of habits with pre-fetched logs.
- `POST /habits/{id}/log/`: Quick endpoint to log habit progress for a specific day.

### 4. Journal (`/api/v1/journal/`)
- `GET /entries/`: Returns paginated entries. Supports filtering (`?mood=happy`).
- `POST /entries/`: Requires multipart/form-data if `images` are included. 

### 5. Goals & Journey
- `GET /goals/goals/` and `GET /journey/memories/timeline/`.

## Common Headers
All protected endpoints require the following headers:
- `Authorization: Bearer <your_access_token>`
- `Content-Type: application/json` (or `multipart/form-data` for uploads)
- `Accept: application/json`
