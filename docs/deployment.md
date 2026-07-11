# Deployment Guide

This guide covers deploying the LifeOS application to production environments. 
LifeOS is composed of a Django backend and a React/Vite frontend.

## 1. Backend Deployment (e.g., Railway, Render, Fly.io, Heroku)

### Prerequisites
- PostgreSQL database
- Environment variables configured (see `environment.md`)

### Steps
1. Configure your host to use Python 3.12+
2. Install dependencies: `pip install -r requirements.txt`
3. The server uses `gunicorn` as the application server:
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
   ```
4. Run migrations during the deployment phase:
   ```bash
   python manage.py migrate
   ```
5. Collect static files (handled by WhiteNoise):
   ```bash
   python manage.py collectstatic --noinput
   ```

## 2. Frontend Deployment (e.g., Vercel, Netlify)

### Prerequisites
- Node.js 20+
- The `VITE_API_URL` environment variable pointing to the deployed backend.

### Steps
1. Build Command:
   ```bash
   npm run build
   ```
2. Output Directory:
   ```
   dist
   ```
3. Routing:
   For Vercel/Netlify, ensure client-side routing is supported by rewriting all requests to `index.html`. 
   Vite's build handles most of this, but you may need a `vercel.json` or `_redirects` file depending on the platform.

## CI/CD integration

GitHub Actions are located in `.github/workflows`. They run linting and testing automatically on PRs. Ensure that all tests pass before triggering a production deployment.
