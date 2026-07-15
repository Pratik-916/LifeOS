from typing import Any, Dict, Optional
import sentry_sdk
from .base import MonitoringProvider

class SentryProvider(MonitoringProvider):
    """
    Sentry implementation of the monitoring provider.
    """

    def capture_exception(self, exception: Exception, extras: Optional[Dict[str, Any]] = None) -> None:
        if extras:
            with sentry_sdk.push_scope() as scope:
                for key, value in extras.items():
                    scope.set_extra(key, value)
                sentry_sdk.capture_exception(exception)
        else:
            sentry_sdk.capture_exception(exception)

    def capture_message(self, message: str, level: str = "info", extras: Optional[Dict[str, Any]] = None) -> None:
        if extras:
            with sentry_sdk.push_scope() as scope:
                for key, value in extras.items():
                    scope.set_extra(key, value)
                sentry_sdk.capture_message(message, level=level)
        else:
            sentry_sdk.capture_message(message, level=level)

    def add_breadcrumb(self, message: str, category: str = "default", level: str = "info", data: Optional[Dict[str, Any]] = None) -> None:
        sentry_sdk.add_breadcrumb(message=message, category=category, level=level, data=data)

    def set_user(self, user_id: str, email: Optional[str] = None, username: Optional[str] = None) -> None:
        user_data = {"id": user_id}
        if email:
            user_data["email"] = email
        if username:
            user_data["username"] = username
        sentry_sdk.set_user(user_data)

    def clear_user(self) -> None:
        sentry_sdk.set_user(None)

    def set_tag(self, key: str, value: str) -> None:
        sentry_sdk.set_tag(key, value)

    def set_context(self, name: str, data: Dict[str, Any]) -> None:
        sentry_sdk.set_context(name, data)

    def flush(self, timeout: float = 2.0) -> None:
        sentry_sdk.flush(timeout=timeout)
