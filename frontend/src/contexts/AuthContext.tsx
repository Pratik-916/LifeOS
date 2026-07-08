import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/auth/authService';
import type { User, Session, ApiError, AuthResponse, LoginResponse } from '../types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
  
  login: (email: string, password: string) => Promise<AuthResponse<LoginResponse>>;
  signup: (data: any) => Promise<AuthResponse<LoginResponse>>;
  logout: () => Promise<AuthResponse<void>>;
  forgotPassword: (email: string) => Promise<AuthResponse<void>>;
  resetPassword: (password: string, token: string) => Promise<AuthResponse<void>>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, session, isAuthenticated, isLoading, error, setUser, setSession, setLoading, setError, clearAuth } = useAuthStore();

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      if (!response.success && response.error) {
        setError(response.error);
      } else if (response.data) {
        setUser(response.data.user);
        setSession(response.data.session);
      }
      return response;
    } catch (e: any) {
      const unexpectedError: ApiError = { code: 'UNEXPECTED_ERROR', message: 'An unexpected error occurred.' };
      setError(unexpectedError);
      return { success: false, error: unexpectedError };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup(data);
      if (!response.success && response.error) {
        setError(response.error);
      } else if (response.data) {
        setUser(response.data.user);
        setSession(response.data.session);
      }
      return response;
    } catch (e: any) {
      const unexpectedError: ApiError = { code: 'UNEXPECTED_ERROR', message: 'An unexpected error occurred.' };
      setError(unexpectedError);
      return { success: false, error: unexpectedError };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await authService.logout();
      clearAuth();
      return response;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.forgotPassword(email);
      if (!response.success && response.error) {
        setError(response.error);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (password: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.resetPassword(password, token);
      if (!response.success && response.error) {
        setError(response.error);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        isLoading,
        error,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        clearError
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
