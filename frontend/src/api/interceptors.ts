import { axiosInstance } from './axios';
import { tokenManager } from '../auth/tokenManager';

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = tokenManager.getRefreshToken();

      if (refreshToken) {
        try {
          // Attempt to refresh
          // NOTE: DO NOT use axiosInstance here to avoid infinite loops, use a clean axios request
          const { default: axios } = await import('axios');
          const { API_CONFIG } = await import('./config');
          
          const res = await axios.post(`${API_CONFIG.baseURL}/auth/jwt/refresh/`, {
            refresh: refreshToken,
          });

          const newAccess = res.data.access;
          const newRefresh = res.data.refresh || refreshToken; // Some backends don't rotate refresh tokens

          tokenManager.setTokens(newAccess, newRefresh);

          // Update the original request's authorization header and retry
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, log out
          tokenManager.clearTokens();
          // We can dispatch a global event or rely on AuthInitializer/store to detect this
          window.dispatchEvent(new Event('auth:unauthorized'));
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, log out
        tokenManager.clearTokens();
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    return Promise.reject(error);
  }
);
