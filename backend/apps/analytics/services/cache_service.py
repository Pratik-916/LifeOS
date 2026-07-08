import functools

class CacheService:
    """
    Dummy cache service interface.
    Currently bypasses cache and executes the function live.
    Future: Wrap with Redis connection.
    """
    @staticmethod
    def get_or_set(key, timeout=300):
        def decorator(func):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                # Redis logic goes here in the future
                return func(*args, **kwargs)
            return wrapper
        return decorator

    @staticmethod
    def invalidate(key):
        pass

    @staticmethod
    def clear_user_cache(user):
        pass
