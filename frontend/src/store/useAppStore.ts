import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { SettingsSlice } from './slices/settingsSlice';
import { createSettingsSlice } from './slices/settingsSlice';

export interface GlobalSlice {
  importData: (data: Partial<AppState>) => void;
  factoryReset: () => void;
  clearLocalData: () => void;
}

export type AppState = SettingsSlice & GlobalSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, get, api) => ({

      ...createSettingsSlice(set, get, api),
      
      importData: (data) => set((state) => ({ ...state, ...data })),
      
      factoryReset: () => {
        localStorage.removeItem('lifeos-storage');
        window.location.reload();
      },
      
      clearLocalData: () => set((state) => ({
        // Clear any specific client-side data if needed
      }))
    }),
    {
      name: 'lifeos-storage',
      version: 3,
      partialize: (state) => ({
        profile: state.profile,
        settings: state.settings,
        backupMetadata: state.backupMetadata,
      }),
    }
  )
);
