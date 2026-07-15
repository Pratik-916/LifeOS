# Operational Runbook
**Production Monitoring & Observability**

## 1. Crash Investigation Workflow

When a new issue is generated in the monitoring provider (e.g., Sentry), follow this workflow:
1. **Triage**: Determine the impact (Crash rate, Number of users affected). If critical, declare an incident.
2. **Review Metadata**: Check `platform`, `environment`, `release`, and `git_commit` tags.
3. **Analyze Breadcrumbs**: Review the steps leading to the error. Note any prior warnings, network failures, or offline events.
4. **Reproduce**: Attempt to reproduce in staging using the same environment and payload constraints.
5. **Resolve**: Develop a fix, deploy, and mark the issue as resolved.

## 2. Issue Triage & Error Grouping
- Sentry automatically groups errors by stack trace.
- **Custom Fingerprints**: If network requests share a generic error (e.g., "Timeout"), ensure custom fingerprints are applied via `extras` to prevent them from diluting the issue tracker.

## 3. Release Verification & Rollback Procedure
- **Verification**: Post-deployment, monitor the `release` filter for new errors.
- **Rollback**: If the crash rate for a new release exceeds the defined threshold (e.g., 2%), immediately revert the commit and re-deploy the previous tag.

## 4. Alerting Recommendations
- **Fatal Error Rate**: Alert if unhandled exceptions exceed 1% of sessions.
- **Backend 500s**: Alert if 500 Server Errors exceed 10/min per node.
- **Mobile Crashes**: Alert if native crash-free sessions drop below 99%.

## 5. Monitoring Checklist (Pre-Launch)
- [ ] DSN variables are securely configured in CI/CD, not hardcoded.
- [ ] Source maps are being uploaded for web and mobile.
- [ ] Privacy filters (`before_send`) are strictly verified against PII leakage.
- [ ] Performance traces are sampled appropriately for the environment (e.g., 10% for prod).

## 6. Common Failure Scenarios

### Missing DSN
**Symptom**: No logs appearing in Sentry.
**Action**: Verify `SENTRY_DSN` is set in the environment variables. The `MonitoringService` gracefully falls back to `NoopProvider` without crashing if missing.

### Rate Limiting
**Symptom**: Events dropped due to quota.
**Action**: Review and adjust sampling rates. Ensure excessive logs (e.g., 404s) are not spamming the error tracker.

### Network Outages
**Symptom**: `Failed to fetch` errors clustering.
**Action**: Group by fingerprint to avoid noise. Ensure UI displays Offline Banner correctly.

## 7. Incident Response Guide
- For Sev-1 incidents (app completely down), communicate via status page.
- Pull the specific `git_commit` logged in the trace.
- Escalate to the platform team if the crash stems from infrastructure (e.g., database timeout).
