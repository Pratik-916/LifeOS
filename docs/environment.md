# Environment Configuration

Reference guide for all required and optional environment variables.

## Backend Variables (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DJANGO_SETTINGS_MODULE` | No | `config.settings.production` | Determines which settings module is loaded. |
| `SECRET_KEY` | **Yes** | - | Cryptographic signing key. MUST be kept secret. |
| `DEBUG` | No | `False` | Enables debug mode. **Never set to True in production**. |
| `ALLOWED_HOSTS` | **Yes** | - | Comma-separated list of domains allowed to host the API (e.g. `api.lifeos.com`). |
| `CORS_ALLOWED_ORIGINS` | **Yes** | - | Comma-separated list of domains allowed to make cross-origin requests (e.g. `https://lifeos.com`). |
| `DATABASE_URL` | **Yes** | - | PostgreSQL connection string in dj-database-url format. |
| `SECURE_SSL_REDIRECT` | No | `True` | Force HTTPS redirects. |
| `LOG_LEVEL` | No | `INFO` | Base logging level (`DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`). |

## Frontend Variables (`frontend/.env.production`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | **Yes** | - | The fully qualified URL pointing to the deployed backend API (e.g., `https://api.lifeos.com/api/v1`). |
