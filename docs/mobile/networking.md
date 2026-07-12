# Networking

The mobile app connects to the LifeOS Django API using Axios.

## Core Features
- **API Client:** Housed in `src/api/client.ts`.
- **Authentication Injection:** A request interceptor automatically retrieves the `accessToken` from Zustand and injects the `Bearer` token.
- **Silent Refresh:** A response interceptor detects `401 Unauthorized`. It pauses the request queue, reads the `refresh_token` from `expo-secure-store`, requests a new token set from `/api/v1/auth/refresh/`, updates the secure store via Zustand, and seamlessly replays the initial request.

## Local Configuration
API hostnames differ between Android (`10.0.2.2`) and iOS (`127.0.0.1`) simulators. This is managed dynamically in `src/api/config.ts`.
