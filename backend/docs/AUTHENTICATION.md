# Authentication

LifeOS uses a modern, production-ready JWT (JSON Web Token) authentication system built on top of Django REST Framework and `rest_framework_simplejwt`.

## Authentication Flow

1. **Registration/Login**: The user provides their credentials (`email` and `password`). Upon successful validation, the server responds with a pair of tokens: an `access` token and a `refresh` token.
2. **Accessing Protected Endpoints**: The client must include the `access` token in the `Authorization` header of subsequent HTTP requests.
   ```http
   Authorization: Bearer <access_token>
   ```
3. **Token Expiration**: Access tokens are short-lived. Once an access token expires, the client uses the `refresh` token to request a new pair.

## JWT Lifecycle

- **Access Token Lifetime**: 15 minutes.
- **Refresh Token Lifetime**: 7 days.
- **Rotation**: Enabled. When a refresh token is used to get a new access token, a *new* refresh token is also returned. The old refresh token is blacklisted and can no longer be used. This adds a layer of security if a refresh token is compromised.
- **Blacklisting**: Enabled. Refresh tokens are tracked in the database. When a user logs out, their current refresh token is explicitly blacklisted.

## Token Refresh Flow

When the client detects a `401 Unauthorized` response with an expired access token code, it automatically performs a token refresh:

1. Client sends a `POST` request to `/api/v1/auth/refresh/` with the current `refresh` token.
2. Server validates the refresh token. If it is valid and not blacklisted, the server generates a new `access` token and a new `refresh` token.
3. The server blacklists the old `refresh` token to prevent reuse.
4. Client saves the new tokens and retries the original protected request with the new `access` token.

## Security Considerations

- Passwords are hashed using Django's strong built-in hashers.
- Strict password validation rules are enforced (minimum 8 characters, at least one uppercase, lowercase, number, and special character).
- Authentication endpoints (`/login`, `/register`, `/forgot-password`) are rate-limited to 5 requests per minute per IP to prevent brute-force attacks.
