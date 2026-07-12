import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  accessToken: string | null;
  setTokens: (access: string, refresh: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isInitializing: true,
  accessToken: null,

  setTokens: async (access: string, refresh: string) => {
    await SecureStore.setItemAsync('access_token', access);
    await SecureStore.setItemAsync('refresh_token', refresh);
    set({ isAuthenticated: true, accessToken: access });
  },

  clearTokens: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    set({ isAuthenticated: false, accessToken: null });
  },

  initializeAuth: async () => {
    try {
      const access = await SecureStore.getItemAsync('access_token');
      if (access) {
        set({ isAuthenticated: true, accessToken: access, isInitializing: false });
      } else {
        set({ isAuthenticated: false, isInitializing: false });
      }
    } catch {
      set({ isAuthenticated: false, isInitializing: false });
    }
  },
}));
