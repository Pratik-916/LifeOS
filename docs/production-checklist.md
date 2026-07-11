# Production Checklist

Complete this checklist before routing live traffic to the application.

## Infrastructure & Configuration
- [ ] Ensure all environment variables are correctly populated in production secrets managers (not in source control).
- [ ] `DEBUG=False` in backend environment.
- [ ] `SECRET_KEY` is a highly secure, randomly generated string.
- [ ] `ALLOWED_HOSTS` matches the production domain strictly.
- [ ] `CORS_ALLOWED_ORIGINS` strictly contains the frontend domain without trailing slashes.
- [ ] The Database URL is correctly mapped to a highly available managed database (e.g. Neon, RDS).

## Security
- [ ] Run `python manage.py check --deploy`. Ensure 0 critical security issues.
- [ ] JWT tokens have appropriate lifespans (e.g. Access 15m, Refresh 7d).
- [ ] SSL/HTTPS is strictly enforced (`SECURE_SSL_REDIRECT=True`).

## Operational Readiness
- [ ] Database migrations have been applied (`python manage.py migrate`).
- [ ] Static files are successfully collected (`python manage.py collectstatic`).
- [ ] Scheduled backups for the PostgreSQL database are enabled at the hosting provider level.
- [ ] Logging is properly configured and successfully streaming to standard output for cloud platform aggregation.
- [ ] The `/api/v1/health/` endpoint returns a `200 OK` response.

## Post-Deployment Verification (Smoke Test)
- [ ] Create a new user account.
- [ ] Successfully sign in with the new account.
- [ ] Create a goal, a habit, and a journal entry.
- [ ] Update account settings and verify toast notifications appear correctly.
- [ ] Hard refresh the application (CTRL+F5) to verify client-side routing fallback works properly and does not return 404s.
