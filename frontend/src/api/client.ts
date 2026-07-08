import './interceptors'; // Import to initialize interceptors
import { axiosInstance } from './axios';

export const apiClient = {
  get: <T = any>(url: string, config?: any) => axiosInstance.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: any) => axiosInstance.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any) => axiosInstance.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: any) => axiosInstance.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: any) => axiosInstance.delete<T>(url, config),
};
