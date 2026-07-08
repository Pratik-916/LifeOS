# CI/CD Pipeline

Our CI pipelines are powered by GitHub Actions. They are designed to be independent, ensuring that a failure in the frontend does not block backend verification, and vice versa.

## Frontend Workflow (`frontend.yml`)
- Triggers on `push` and `pull_request` to `main`.
- Checks out the code and sets up Node 20.x.
- Installs dependencies using `npm ci`.
- Runs `npm run lint`.
- Runs `npm run build`.

## Backend Workflow (`backend.yml`)
- Triggers on `push` and `pull_request` to `main`.
- Checks out the code and sets up Python 3.12.
- Installs dependencies from `requirements.txt`.
- Runs `python manage.py check`.
- Runs `python manage.py test`.
