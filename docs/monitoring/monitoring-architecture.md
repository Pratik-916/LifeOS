# Monitoring Architecture

LifeOS implements a **Provider-Agnostic Monitoring Abstraction Layer** across Backend, Web, and Mobile environments.

## Core Philosophy

1. **Provider Independence**: No feature module ever imports a third-party monitoring SDK (e.g., Sentry) directly.
2. **Graceful Fallback**: If no monitoring credentials are provided, the system seamlessly falls back to a `NoopProvider`.
3. **Privacy First**: Sensitive data is filtered at the lowest possible level before transmission.
4. **Structured Logging Integration**: Application logs natively integrate with the monitoring breadcrumb trails.

## Abstraction Interfaces

The abstraction layer exposes standard methods:
- `captureException(Error, extras)`
- `captureMessage(Message, level, extras)`
- `addBreadcrumb(Message, category, level, data)`
- `setUser(id, email, username)`
- `clearUser()`
- `setTag(key, value)`
- `setContext(name, data)`

## Directory Structure

- Backend: `backend/core/monitoring/`
- Frontend: `frontend/src/services/monitoring/`
- Mobile: `mobile/src/services/monitoring/`
