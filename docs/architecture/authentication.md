# Authentication Architecture

## JWT Flow
LifeOS uses JSON Web Tokens (JWT) for stateless authentication.
1. **Login:** The user sends credentials to `/auth/login/`. The server returns an `access` token (short-lived) and a `refresh` token (long-lived).
2. **Storage:** Tokens are stored locally (currently `localStorage` via Zustand `AuthContext`).
3. **Interceptors:** The Axios `apiClient` intercepts all requests. It injects the `Authorization: Bearer <token>` header.
4. **Refresh:** If a request fails with a 401 Unauthorized, the interceptor automatically attempts to call `/auth/token/refresh/` to get a new access token, then retries the original request.
5. **Logout:** Logging out clears the tokens and invalidates the user's session on the client.
