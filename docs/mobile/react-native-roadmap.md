# React Native Application Roadmap

This roadmap outlines the phases for building the native mobile application for LifeOS now that the backend APIs are standardized and ready.

## Phase 1: Native Foundation & Networking
- Scaffold project (Expo or bare React Native).
- Setup routing (React Navigation or Expo Router).
- Implement the Axios API client with the exact interceptor logic used in the web app.
- Integrate `react-native-keychain` for secure JWT storage.
- Implement the Login, Register, and Splash screens.

## Phase 2: Core Data Fetching & State
- Setup React Query (`@tanstack/react-query`).
- Migrate the `UserContext` and global auth state.
- Create the core domain hooks (e.g., `useTasks`, `useHabits`).

## Phase 3: Primary Features (UI/UX)
- Implement the **Dashboard** with summary widgets.
- Implement the **Planner** view (Task lists, creation modals, optimistic updates).
- Implement the **Habits** tracker (Swipe-to-log, streak visualization).

## Phase 4: Media & Rich Content
- Implement the **Journal** with a native rich text editor.
- Implement `expo-image-picker` and wire it up to the `multipart/form-data` endpoints for Journal and Journey images.

## Phase 5: Push Notifications (Future Extension)
- Integrate Firebase Cloud Messaging (FCM) on the backend (creating a `DeviceRegistration` model).
- Request push notification permissions on iOS/Android.
- Wire up habit reminders and task due date alerts.
