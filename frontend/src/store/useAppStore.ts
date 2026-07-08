import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaskSlice } from './slices/taskSlice';
import { createTaskSlice } from './slices/taskSlice';
import type { HabitSlice } from './slices/habitSlice';
import { createHabitSlice } from './slices/habitSlice';
import type { GoalSlice } from './slices/goalSlice';
import { createGoalSlice } from './slices/goalSlice';
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
}

export type AppState = TaskSlice & HabitSlice & GoalSlice & JournalSlice & ActivitySlice & SettingsSlice & MemorySlice & GlobalSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, get, api) => ({
      ...createTaskSlice(set, get, api),
      ...createHabitSlice(set, get, api),
      ...createGoalSlice(set, get, api),
      ...createJournalSlice(set, get, api),
      ...createActivitySlice(set, get, api),
      ...createSettingsSlice(set, get, api),
      ...createMemorySlice(set, get, api),
      
      importData: (data) => set((state) => ({ ...state, ...data })),
      
      factoryReset: () => {
        // Clear everything by removing localStorage entirely and reloading the page
        localStorage.removeItem('lifeos-storage');
        window.location.reload();
      },
      
      clearLocalData: () => set((state) => ({
        tasks: [],
        habits: [],
        goals: [],
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
