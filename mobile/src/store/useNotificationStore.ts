import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationState {
  globalEnabled: boolean;
  plannerEnabled: boolean;
  habitsEnabled: boolean;
  goalsEnabled: boolean;
  journalEnabled: boolean;
  journeyEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm
  
  // Actions
  toggleGlobal: (enabled: boolean) => void;
  togglePlanner: (enabled: boolean) => void;
  toggleHabits: (enabled: boolean) => void;
  toggleGoals: (enabled: boolean) => void;
  toggleJournal: (enabled: boolean) => void;
  toggleJourney: (enabled: boolean) => void;
  toggleSound: (enabled: boolean) => void;
  toggleVibration: (enabled: boolean) => void;
  setQuietHours: (enabled: boolean, start: string, end: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      globalEnabled: false, // Default false until requested
      plannerEnabled: true,
      habitsEnabled: true,
      goalsEnabled: true,
      journalEnabled: true,
      journeyEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',

      toggleGlobal: (enabled) => set({ globalEnabled: enabled }),
      togglePlanner: (enabled) => set({ plannerEnabled: enabled }),
      toggleHabits: (enabled) => set({ habitsEnabled: enabled }),
      toggleGoals: (enabled) => set({ goalsEnabled: enabled }),
      toggleJournal: (enabled) => set({ journalEnabled: enabled }),
      toggleJourney: (enabled) => set({ journeyEnabled: enabled }),
      toggleSound: (enabled) => set({ soundEnabled: enabled }),
      toggleVibration: (enabled) => set({ vibrationEnabled: enabled }),
      setQuietHours: (enabled, start, end) => set({ quietHoursEnabled: enabled, quietHoursStart: start, quietHoursEnd: end }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
