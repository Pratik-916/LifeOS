# API Documentation

The LifeOS API follows RESTful conventions and uses a standardized response wrapper for all endpoints.

## Base URL
All API endpoints are prefixed with `/api/v1/`.

## Standard Response Format
Every endpoint returns a consistent JSON envelope to simplify frontend state management and error handling.

### Success Response
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "Human readable error message",
    "details": {
      "field_name": ["Specific error detail"]
    }
  }
}
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/api/v1/auth/register/`

Creates a new user account and returns an initial set of JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "password_confirm": "StrongPassword123!",
  "first_name": "Jane",
  "last_name": "Doe"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "Jane",
      "last_name": "Doe"
    },
    "tokens": {
      "refresh": "eyJhb...",
      "access": "eyJhb..."
    }
  }
}
```

### 2. Login User
**POST** `/api/v1/auth/login/`

Authenticates a user and returns JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "refresh": "eyJhb...",
    "access": "eyJhb...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "avatar": null
    }
  }
}
```

### 3. Refresh Token
**POST** `/api/v1/auth/refresh/`

Exchanges a valid refresh token for a new access/refresh token pair.

**Request Body:**
```json
{
  "refresh": "eyJhb..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "access": "eyJhb...",
    "refresh": "eyJhb..."
  }
}
```

### 4. Logout User
**POST** `/api/v1/auth/logout/`

Blacklists the provided refresh token so it cannot be used again. Requires authentication.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "refresh": "eyJhb..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully logged out.",
  "data": {}
}
```

---

## User Endpoints

### 1. Get Current User Profile
**GET** `/api/v1/users/me/`

Retrieves the profile and settings for the currently authenticated user. Requires authentication.

**Headers:** `Authorization: Bearer <access_token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "avatar": null,
    "is_verified": false,
    "profile": {
      "bio": "",
      "timezone": "UTC",
      "country": "",
      "language": "en",
      "birth_date": null,
      "website": ""
    },
    "settings": {
      "theme": "system",
      "accent_color": "blue",
      "default_reminder_time": 15,
      "week_start": 1,
      "font_size": "medium",
      "privacy_mode": false,
      "dashboard_widget_preferences": {},
      "notification_preferences": {}
    }
  }
}
```

### 2. Update Current User Profile
**PATCH** `/api/v1/users/me/`

Partially updates the user, their profile, or their settings. Requires authentication.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body (Example):**
```json
{
  "first_name": "Janet",
  "profile": {
    "bio": "Software Engineer",
    "timezone": "America/New_York"
  },
  "settings": {
    "theme": "dark"
  }
}
```

**Success Response (200 OK):** (Returns the fully updated user object).
