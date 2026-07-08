import type { StateCreator } from 'zustand';
import type { Activity } from '../../types';
import type { AppState } from '../useAppStore';
import { initialActivities } from '../../data/initialState';

export interface ActivitySlice {
  activities: Activity[];
  addActivity: (activityData: Omit<Activity, 'id' | 'timestamp'>) => void;
}

export const createActivitySlice: StateCreator<AppState, [], [], ActivitySlice> = (set) => ({
  activities: initialActivities,
  
  addActivity: (activityData) => {
    set((state) => {
      const newActivity: Activity = {
        ...activityData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      return { activities: [newActivity, ...state.activities].slice(0, 50) };
    });
  }
});
