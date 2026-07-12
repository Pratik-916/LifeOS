# Development Guide

## Prerequisites
- Node.js
- Expo Go (on physical device) OR Android Studio / Xcode (for simulators)

## Running the App
1. Create a `.env` file from `.env.example` in `mobile/`.
2. Ensure the Django backend is running locally (`python manage.py runserver`).
3. If using a physical device, update `.env` to use your computer's local IPv4 address (e.g., `EXPO_PUBLIC_API_URL=http://192.168.1.X:8000`).
4. Run `npm start` in the `mobile/` directory.
5. Scan the QR code with Expo Go or press `a`/`i` to launch on simulators.

## Type Checking & Linting
Run `npx tsc` to verify TypeScript integrity across the codebase.
Run `npm run lint` to enforce ESLint coding standards.
