import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ApiError } from '../types/auth';
import { tokenManager } from '../auth/tokenManager';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: ApiError | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start loading initially until AuthInitializer finishes
      error: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearAuth: () => {
        tokenManager.clearTokens();
        set({ user: null, isAuthenticated: false, error: null, isLoading: false });
      },
    }),
    {
      name: 'lifeos-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
