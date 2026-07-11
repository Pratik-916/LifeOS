import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { tokenManager } from '../auth/tokenManager';
import { apiClient } from '../api/client';
import { authEndpoints } from '../api/endpoints/auth';
import type { User } from '../types/auth';
import type { ApiError } from '../api/apiTypes';
import { handleApiError } from '../api/errorHandler';
import { NotificationService } from '../services/notificationService';
import { useQueryClient } from '@tanstack/react-query';
import { plannerApi } from '../features/planner/api/planner';
import { plannerKeys } from '../features/planner/api/planner.keys';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
  
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, setUser, clearAuth } = useAuthStore();
  const [error, setError] = useState<ApiError | null>(null);
  const queryClient = useQueryClient();

  const clearError = useCallback(() => setError(null), []);

  const login = async (email: string, password: string) => {
    try {
      clearError();
      const response = await apiClient.post(authEndpoints.login, { email, password });
      tokenManager.setTokens(response.data.access, response.data.refresh);
      
      const userResponse = await apiClient.get(authEndpoints.me);
      
      const mappedUser: User = {
        id: userResponse.data.id,
        email: userResponse.data.email,
        firstName: userResponse.data.first_name,
        lastName: userResponse.data.last_name,
        avatarUrl: userResponse.data.avatar,
        createdAt: userResponse.data.created_at || new Date().toISOString(),
      };
      
      setUser(mappedUser);
      NotificationService.success('Logged in successfully');

      // Route Prefetching
      queryClient.prefetchQuery({
        queryKey: plannerKeys.statistics(),
        queryFn: () => plannerApi.getStatistics(),
      });
      queryClient.prefetchQuery({
        queryKey: plannerKeys.tasksList(),
        queryFn: () => plannerApi.getTasks(),
      });
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      throw apiError;
    }
  };

  const signup = async (data: any) => {
    try {
      clearError();
      await apiClient.post(authEndpoints.signup, data);
      await login(data.email, data.password);
      NotificationService.success('Account created successfully');
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      throw apiError;
    }
  };

  const logout = useCallback(() => {
    clearAuth();
    NotificationService.info('Logged out successfully');
  }, [clearAuth]);

  const forgotPassword = async (email: string) => {
    try {
      clearError();
      await apiClient.post(authEndpoints.resetPassword, { email });
      NotificationService.success('Password reset email sent');
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      throw apiError;
    }
  };

  const resetPassword = async (password: string, token: string) => {
    try {
      clearError();
      await apiClient.post(authEndpoints.resetPasswordConfirm, { new_password: password, token });
      NotificationService.success('Password has been reset');
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      throw apiError;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      clearError();
      await apiClient.put(authEndpoints.changePassword, { old_password: oldPassword, new_password: newPassword });
      NotificationService.success('Password updated successfully');
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      throw apiError;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      clearError();
      const payload: any = {};
      if (data.firstName) payload.first_name = data.firstName;
      if (data.lastName) payload.last_name = data.lastName;
      if (data.email) payload.email = data.email;
      
      const response = await apiClient.patch(authEndpoints.me, payload);
      
      const mappedUser: User = {
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        avatarUrl: response.data.avatar,
        createdAt: response.data.created_at || new Date().toISOString(),
      };
      
      setUser(mappedUser);
      NotificationService.success('Profile updated successfully');
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      throw apiError;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
