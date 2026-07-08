import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session, ApiError } from '../types/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: ApiError | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearAuth: () => set({ user: null, session: null, isAuthenticated: false, error: null }),
    }),
    {
      name: 'lifeos-auth',
      // Only persist user and session, not loading/error states
      partialize: (state) => ({ user: state.user, session: state.session, isAuthenticated: state.isAuthenticated }),
    }
  )
);
