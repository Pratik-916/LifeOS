# Networking

The mobile app connects to the LifeOS Django API using Axios.

## Core Features
- **API Client:** Housed in `src/api/` divided logically into `client.ts`, `axios.ts` (base instance), `endpoints.ts` (URLs), and `errors.ts` (parsing).
- **Authentication Injection:** A request interceptor automatically retrieves the `accessToken` from Zustand and injects the `Bearer` token.
- **Silent Refresh:** A response interceptor detects `401 Unauthorized`. It pauses the request queue, reads the `refresh_token` from `expo-secure-store`, requests a new token set, updates the secure store via Zustand, and seamlessly replays the initial request.

## Local Configuration
API hostnames are loaded exclusively from `.env` via `EXPO_PUBLIC_API_URL` and parsed via Zod inside `src/config/environment.ts`. Do not hardcode IPs.
