import abc
from typing import Any, Dict, Optional

class MonitoringProvider(abc.ABC):
    """
    Abstract interface for monitoring providers.
    """

    @abc.abstractmethod
    def capture_exception(self, exception: Exception, extras: Optional[Dict[str, Any]] = None) -> None:
        pass

    @abc.abstractmethod
    def capture_message(self, message: str, level: str = "info", extras: Optional[Dict[str, Any]] = None) -> None:
        pass

    @abc.abstractmethod
    def add_breadcrumb(self, message: str, category: str = "default", level: str = "info", data: Optional[Dict[str, Any]] = None) -> None:
        pass

    @abc.abstractmethod
    def set_user(self, user_id: str, email: Optional[str] = None, username: Optional[str] = None) -> None:
        pass

    @abc.abstractmethod
    def clear_user(self) -> None:
        pass

    @abc.abstractmethod
    def set_tag(self, key: str, value: str) -> None:
        pass

    @abc.abstractmethod
    def set_context(self, name: str, data: Dict[str, Any]) -> None:
        pass

    @abc.abstractmethod
    def flush(self, timeout: float = 2.0) -> None:
        pass
