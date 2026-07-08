import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { tokenManager } from '../../auth/tokenManager';
import { apiClient } from '../../api/client';
import { authEndpoints } from '../../api/endpoints/auth';
import { PageLoader } from '../ui/loaders/PageLoader';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { setUser, clearAuth, setLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const token = tokenManager.getAccessToken();

      if (!token) {
        if (isMounted) {
          clearAuth();
          setLoading(false);
          setIsInitialized(true);
        }
        return;
      }

      try {
        setLoading(true);
        // Using apiClient means interceptors will automatically refresh if token is expired!
        const response = await apiClient.get(authEndpoints.me);
        if (isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        if (isMounted) {
          // If error happened, interceptor would have tried to refresh.
          // If refresh failed, clearAuth() should be called via the event listener (below)
          // or we just clear here.
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for unauthorized events from interceptors
    const handleUnauthorized = () => {
      if (isMounted) {
        clearAuth();
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [setUser, clearAuth, setLoading]);

  if (!isInitialized) {
    return <PageLoader />;
  }

  return <>{children}</>;
};
