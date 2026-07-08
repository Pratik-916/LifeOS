from django.apps import AppConfig

class PlannerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.planner'

    def ready(self):
        import apps.planner.signals  # noqa
