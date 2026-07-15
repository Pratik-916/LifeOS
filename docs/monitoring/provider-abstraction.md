# Provider Abstraction

To add a new provider (e.g. Datadog):
1. Implement MonitoringProvider interface.
2. Update MonitoringService.initialize() to return the new provider based on environment variables.
