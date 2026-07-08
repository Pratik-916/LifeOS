from django.apps import AppConfig

class JourneyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.journey'

    def ready(self):
        import apps.journey.signals  # noqa
