# Local Setup

## Prerequisites
- Node.js 20.x
- Python 3.12
- Git

## Backend Setup
1. `cd backend`
2. `python -m venv .venv`
3. Activate the virtual environment (`source .venv/bin/activate` or `.\.venv\Scripts\activate`)
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`

## Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Both servers will now be running concurrently. Access the app at `http://localhost:5174/`.
