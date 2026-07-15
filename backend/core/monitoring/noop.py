from typing import Any, Dict, Optional
from .base import MonitoringProvider

class NoopProvider(MonitoringProvider):
    """
    Fallback provider that does nothing. Used when no DSN is provided or monitoring is disabled.
    """

    def capture_exception(self, exception: Exception, extras: Optional[Dict[str, Any]] = None) -> None:
        pass

    def capture_message(self, message: str, level: str = "info", extras: Optional[Dict[str, Any]] = None) -> None:
        pass

    def add_breadcrumb(self, message: str, category: str = "default", level: str = "info", data: Optional[Dict[str, Any]] = None) -> None:
        pass

    def set_user(self, user_id: str, email: Optional[str] = None, username: Optional[str] = None) -> None:
        pass

    def clear_user(self) -> None:
        pass

    def set_tag(self, key: str, value: str) -> None:
        pass

    def set_context(self, name: str, data: Dict[str, Any]) -> None:
        pass

    def flush(self, timeout: float = 2.0) -> None:
        pass
