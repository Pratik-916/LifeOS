import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/useAuthStore';
import { config } from '../config/config';
import { endpoints } from './endpoints';

export const apiClient = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
});

apiClient.interceptors.request.use(
  async (reqConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${config.api.baseURL}${endpoints.auth.refresh}`, {
            refresh: refreshToken,
          });

          const newAccess = res.data.data?.access || res.data.access;
          const newRefresh = res.data.data?.refresh || res.data.refresh || refreshToken;

          await useAuthStore.getState().setTokens(newAccess, newRefresh);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          await useAuthStore.getState().clearTokens();
          return Promise.reject(refreshError);
        }
      } else {
        await useAuthStore.getState().clearTokens();
      }
    }
    return Promise.reject(error);
  }
);
