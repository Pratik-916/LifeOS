# Security Architecture

This document outlines the security mechanisms implemented in the production ready LifeOS application.

## 1. Authentication
- The backend utilizes **JWT (JSON Web Tokens)** for authentication.
- Access tokens expire in 15 minutes. Refresh tokens expire in 7 days and are rotated upon use.
- The `rest_framework_simplejwt.token_blacklist` app is enabled to invalidate tokens upon logout.

## 2. Headers and Cookies
- `SECURE_SSL_REDIRECT = True`: Enforces HTTPS.
- `SESSION_COOKIE_SECURE = True` & `CSRF_COOKIE_SECURE = True`: Prevents cookies from being transmitted over unencrypted connections.
- HSTS (HTTP Strict Transport Security) is enabled with a 1-year max age, including subdomains and preload.
- `SECURE_BROWSER_XSS_FILTER` and `SECURE_CONTENT_TYPE_NOSNIFF` are enabled to prevent MIME-sniffing and cross-site scripting.

## 3. CORS Configuration
- CORS is strictly controlled via `CORS_ALLOWED_ORIGINS`.
- `CORS_ALLOW_ALL_ORIGINS` is set to `False` in production.
- Only the specific domains defined in the `.env` file are permitted to interact with the API.

## 4. Passwords
- Django's built-in password validators are enforced:
  - Minimum 8 characters.
  - Complex password validator (requires alphanumeric and special characters).
  - Common password rejection.

## 5. Logging
- The application uses structured JSON logging.
- `django.request` is set to `ERROR` to prevent logging sensitive user inputs accidentally appended in query strings or payloads.
