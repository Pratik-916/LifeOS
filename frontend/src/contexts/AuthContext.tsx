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
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, setUser, clearAuth } = useAuthStore();
  const [error, setError] = useState<ApiError | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const login = async (email: string, password: string) => {
    try {
      clearError();
      const response = await apiClient.post(authEndpoints.login, { email, password });
      tokenManager.setTokens(response.data.access, response.data.refresh);
      
      const userResponse = await apiClient.get(authEndpoints.me);
      setUser(userResponse.data);
      NotificationService.success('Logged in successfully');
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
