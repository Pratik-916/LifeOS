import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HabitSlice } from './slices/habitSlice';
import { createHabitSlice } from './slices/habitSlice';
import type { JournalSlice } from './slices/journalSlice';
import { createJournalSlice } from './slices/journalSlice';
import type { ActivitySlice } from './slices/activitySlice';
import { createActivitySlice } from './slices/activitySlice';
import type { SettingsSlice } from './slices/settingsSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import type { MemorySlice } from './slices/memorySlice';
import { createMemorySlice } from './slices/memorySlice';

export interface GlobalSlice {
  importData: (data: Partial<AppState>) => void;
  factoryReset: () => void;
  clearLocalData: () => void;
  goals: any[];
}

export type AppState = HabitSlice & JournalSlice & ActivitySlice & SettingsSlice & MemorySlice & GlobalSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...createHabitSlice(set, get, api),
      ...createJournalSlice(set, get, api),
      ...createActivitySlice(set, get, api),
      ...createSettingsSlice(set, get, api),
      ...createMemorySlice(set, get, api),
      
      goals: [],

      importData: (data) => set((state) => ({ ...state, ...data })),
      
      factoryReset: () => {
        // Clear everything by removing localStorage entirely and reloading the page
        localStorage.removeItem('lifeos-storage');
        window.location.reload();
      },
      
      clearLocalData: () => set((state) => ({
        habits: [],
        activities: [],
        journalEntries: [],
        memories: [],
        // Keep settings and profile intact
      }))
    }),
    {
      name: 'lifeos-storage',
      version: 2,
      partialize: (state) => ({
        profile: state.profile,
        settings: state.settings,
        backupMetadata: state.backupMetadata,
      }),
    }
  )
);
