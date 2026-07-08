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
      const refreshToken = tokenManager.getRefreshToken();
      const accessToken = tokenManager.getAccessToken();

      if (!refreshToken) {
        if (isMounted) {
          clearAuth();
          setLoading(false);
          setIsInitialized(true);
        }
        return;
      }

      try {
        setLoading(true);
        
        // Use clean axios for refresh to avoid interceptor loops
        const { default: axios } = await import('axios');
        const { API_CONFIG } = await import('../../api/config');
        
        const res = await axios.post(`${API_CONFIG.baseURL}${authEndpoints.refresh}`, {
          refresh: refreshToken,
        });
        
        const newAccess = res.data.data?.access || res.data.access;
        const newRefresh = res.data.data?.refresh || res.data.refresh || refreshToken;
        tokenManager.setTokens(newAccess, newRefresh);
        
        const response = await apiClient.get(authEndpoints.me);
        if (isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        if (isMounted) {
          clearAuth();
          // Explicitly clear localstorage
          localStorage.removeItem('lifeos-auth');
          tokenManager.clearTokens();
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
