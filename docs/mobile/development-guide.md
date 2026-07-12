# Development Guide

## Prerequisites
- Node.js
- Expo Go (on physical device) OR Android Studio / Xcode (for simulators)

## Running the App
1. Ensure the Django backend is running locally (`python manage.py runserver`).
2. Ensure you are on the same WiFi network if testing on a physical device.
3. If using a physical device, update `src/api/config.ts` to use your computer's local IPv4 address (e.g., `192.168.1.X:8000`) instead of localhost.
4. Run `npm start` in the `mobile/` directory.
5. Scan the QR code with Expo Go or press `a`/`i` to launch on simulators.

## Type Checking
Run `npx tsc` to verify TypeScript integrity across the codebase.
