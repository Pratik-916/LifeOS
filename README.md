# LifeOS

[![Frontend CI](https://github.com/pratikpala/lifeos/actions/workflows/frontend.yml/badge.svg)](https://github.com/pratikpala/lifeos/actions/workflows/frontend.yml)
[![Backend CI](https://github.com/pratikpala/lifeos/actions/workflows/backend.yml/badge.svg)](https://github.com/pratikpala/lifeos/actions/workflows/backend.yml)

![LifeOS Cover](https://via.placeholder.com/1200x600.png?text=LifeOS)

A modern full-stack productivity operating system built with React, TypeScript, Zustand, and Django REST Framework. LifeOS is designed with a premium, elegant UI matching top-tier SaaS applications.

## 🌟 Features

- **Dashboard**: Unified overview of tasks, goals, habits, and journals.
- **Planner**: Robust task management system with recurring tasks and subtasks.
- **Habits**: Comprehensive habit tracker with visual streak monitoring.
- **Journal**: Beautiful markdown-enabled personal journal with mood tracking.
- **Journey**: Visual timeline for recording major life memories.
- **Goals**: High-level goal tracking and milestone decomposition.
- **Analytics**: Deep visual insights into your productivity and habits.

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **State Management**: Zustand (UI State), React Query (Server State)
- **Styling**: Tailwind CSS + Custom Semantic Theming
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Framework**: Django 5.1 & Django REST Framework (DRF)
- **Database**: SQLite (Development)
- **Authentication**: JWT (SimpleJWT)

## 📚 Documentation
- [Architecture Decisions](docs/ARCHITECTURE_DECISIONS.md)
- [Frontend Architecture](docs/architecture/frontend.md)
- [Backend Architecture](docs/architecture/backend.md)
- [API Design](docs/architecture/api.md)
- [Development Setup](docs/development/setup.md)
- [Contributing Guide](docs/development/contributing.md)

## 🛠️ Installation & Development Setup

### Backend Setup
1. `cd backend`
2. `python -m venv .venv`
3. Activate the virtual environment (`source .venv/bin/activate` or `.\.venv\Scripts\activate`)
4. `pip install -r requirements.txt`
5. `python manage.py migrate`
6. `python manage.py runserver`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Both servers will now be running concurrently. Access the app at `http://localhost:5174/`.

## 📁 Folder Structure

```text
LifeOS/
├── backend/           # Django REST Framework application
├── docs/              # Architecture and Development Guides
│   ├── architecture/
│   └── development/
├── frontend/          # React + Vite application
│   ├── src/           # Frontend source code
│   ├── public/        # Static assets
│   └── package.json   # Dependencies
├── README.md          # Project overview
└── LICENSE            # MIT License
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created by **Pratik Pala**
