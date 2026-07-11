# Backup and Recovery Procedures

## Database Backups

Because LifeOS stores sensitive user data (journals, habits, goals), automated backups are strictly required.

### 1. Managed Service Backups (Recommended)
If you are deploying on a modern managed PostgreSQL provider (Neon, Supabase, Render, AWS RDS):
- Enable **Point-in-Time Recovery (PITR)**.
- Ensure automated daily snapshots are enabled with a minimum retention period of 7 days.

### 2. Manual Backup via `pg_dump`
If you manage your own database, you must configure a cron job to dump the database regularly:
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```
Store these backups securely offsite (e.g., AWS S3).

## Restoration Procedure
If a database restore is required:
1. Ensure the application is placed into maintenance mode (scale backend workers to 0).
2. Create a new empty database.
3. Restore using `psql`:
```bash
psql $NEW_DATABASE_URL < backup_file.sql
```
4. Verify data integrity manually before updating the `DATABASE_URL` environment variable and scaling the backend workers back up.
