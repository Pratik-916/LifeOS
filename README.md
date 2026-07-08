# LifeOS

![LifeOS Cover](https://via.placeholder.com/1200x600.png?text=LifeOS)

A modern full-stack productivity operating system built with React, TypeScript, Zustand, and Django REST Framework. LifeOS is designed with a premium, elegant UI matching top-tier SaaS applications like Linear and Vercel.

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
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **State Management**: Zustand (with local storage persistence)
- **Styling**: Tailwind CSS + Custom Semantic Theming
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

### Backend (Upcoming)
- Django REST Framework (DRF)
- PostgreSQL
- JWT Authentication

## 📸 Screenshots

*(Screenshots coming soon)*

## 🛠️ Installation & Development Setup

LifeOS currently relies on a robust frontend architecture utilizing `localStorage` and `zustand/persist`. A Django backend is on the immediate roadmap.

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/pratikpala/lifeos.git
   cd lifeos/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## 📁 Folder Structure

```text
LifeOS/
├── frontend/          # React + Vite application
│   ├── src/           # Frontend source code
│   ├── public/        # Static assets
│   └── package.json   # Dependencies
├── backend/           # Future Django application
├── docs/              # Project documentation
├── README.md          # Project overview
└── LICENSE            # MIT License
```

## 🗺️ Future Roadmap

- [ ] **Backend Integration**: Full Django REST Framework integration with JWT Authentication.
- [ ] **PostgreSQL Database**: Migrating state from `localStorage` to a robust relational database.
- [ ] **File Uploads**: Pre-signed AWS S3 URL integration for profile avatars and journal images.
- [ ] **AI Assistant**: Automated journal tagging and goal decomposition using LLMs.
- [ ] **Mobile Responsiveness**: Complete optimization for mobile browsers and PWA capabilities.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created by **Pratik Pala**
