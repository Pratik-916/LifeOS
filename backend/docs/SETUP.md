# Local Setup & Environment Configuration

This guide covers how to set up the LifeOS backend for local development.

## Prerequisites

- Python 3.12+
- PostgreSQL 16+
- Node.js (for the frontend, but helpful context)

## Environment Variables

LifeOS uses `python-decouple` to manage environment variables securely. Do not hardcode secrets into the source code.

Create a `.env` file in the root of the `backend/` directory with the following variables:

```env
# Required for development
SECRET_KEY=your_super_secret_development_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173

# Database configuration
DATABASE_URL=postgres://postgres:your_password@localhost:5432/lifeos
```

## Setup Instructions

1. **Create the Database**
   Ensure PostgreSQL is running. Connect via `psql` or pgAdmin and run:
   ```sql
   CREATE DATABASE lifeos;
   ```

2. **Create a Virtual Environment**
   Navigate to the `backend/` directory and create an isolated Python environment:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate   # Windows
   # source .venv/bin/activate  # Mac/Linux
   ```

3. **Install Dependencies**
   Install the required packages from `base.txt`:
   ```bash
   pip install -r requirements/base.txt
   ```

4. **Run Migrations**
   Apply the database schemas:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a Superuser**
   Create an administrative account for accessing the Django Admin:
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the Development Server**
   ```bash
   python manage.py runserver
   ```
   The API will now be available at `http://localhost:8000/`.

## API Documentation

While the server is running, you can access the interactive Swagger (OpenAPI) documentation at:
- `http://localhost:8000/api/schema/swagger-ui/`
