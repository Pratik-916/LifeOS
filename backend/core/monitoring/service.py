import os
from typing import Any, Dict, Optional
from .base import MonitoringProvider
from .noop import NoopProvider
from .sentry import SentryProvider

class MonitoringService:
    """
    Centralized monitoring service orchestrator.
    """
    _instance = None
    _provider: MonitoringProvider = NoopProvider()

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MonitoringService, cls).__new__(cls)
        return cls._instance

    @classmethod
    def initialize(cls) -> None:
        """
        Initialize the monitoring provider based on environment variables.
        """
        dsn = os.environ.get("SENTRY_DSN")
        if dsn:
            # Initialize Sentry SDK here (usually done in settings, but we wrap it for safety)
            # Actually, Sentry initialization is best done in Django settings to attach integrations.
            # We just set the provider here.
            cls._provider = SentryProvider()
        else:
            cls._provider = NoopProvider()

    @classmethod
    def capture_exception(cls, exception: Exception, extras: Optional[Dict[str, Any]] = None) -> None:
        cls._provider.capture_exception(exception, extras)

    @classmethod
    def capture_message(cls, message: str, level: str = "info", extras: Optional[Dict[str, Any]] = None) -> None:
        cls._provider.capture_message(message, level, extras)

    @classmethod
    def add_breadcrumb(cls, message: str, category: str = "default", level: str = "info", data: Optional[Dict[str, Any]] = None) -> None:
        cls._provider.add_breadcrumb(message, category, level, data)

    @classmethod
    def set_user(cls, user_id: str, email: Optional[str] = None, username: Optional[str] = None) -> None:
        cls._provider.set_user(user_id, email, username)

    @classmethod
    def clear_user(cls) -> None:
        cls._provider.clear_user()

    @classmethod
    def set_tag(cls, key: str, value: str) -> None:
        cls._provider.set_tag(key, value)

    @classmethod
    def set_context(cls, name: str, data: Dict[str, Any]) -> None:
        cls._provider.set_context(name, data)

    @classmethod
    def flush(cls, timeout: float = 2.0) -> None:
        cls._provider.flush(timeout)
