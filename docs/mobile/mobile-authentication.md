# Mobile Authentication Strategy

## JWT Lifecycle in React Native

The backend strictly uses JSON Web Tokens (JWT) for authentication. There are no session cookies to manage.

### 1. Login
Send `POST /api/v1/auth/login/` with username and password.
Store the returned `access` and `refresh` tokens securely using a native keychain wrapper (e.g., `react-native-keychain` or `expo-secure-store`).

### 2. Attaching Tokens
Use an Axios interceptor in the React Native app to attach the access token to every outgoing request.
```javascript
config.headers.Authorization = `Bearer ${accessToken}`;
```

### 3. Token Refresh
Access tokens expire in **15 minutes**.
When an API call returns `401 Unauthorized`:
1. Pause all outgoing requests in the interceptor queue.
2. Send `POST /api/v1/auth/refresh/` with the `refresh` token.
3. If successful, update the secure storage with the new access (and optionally refresh) token.
4. Retry the paused requests.
5. If the refresh fails (token expired/blacklisted), log the user out and redirect to the Login screen.

### 4. Logout
Send `POST /api/v1/auth/logout/` with the `refresh` token to blacklist it on the server. Then clear the tokens from the local secure storage.
