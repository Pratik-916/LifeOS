import type { StateCreator } from 'zustand';
import type { Habit } from '../../types';
import type { AppState } from '../useAppStore';
import { format, subDays } from 'date-fns';
import { initialHabits } from '../../data/initialState';

export interface HabitSlice {
  habits: Habit[];
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'datesCompleted' | 'streak' | 'longestStreak' | 'currentCount' | 'completedToday'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabit: (habitId: string) => void;
  resetDailyHabits: () => void;
}

export const createHabitSlice: StateCreator<AppState, [], [], HabitSlice> = (set) => ({
  habits: initialHabits,
  
  addHabit: (habitData) => {
    set((state) => {
      const newHabit: Habit = {
        ...habitData,
        id: Date.now().toString(),
        datesCompleted: [],
        streak: 0,
        longestStreak: 0,
        currentCount: 0,
        completedToday: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newActivities = [
        {
          id: Date.now().toString(),
          type: 'habit' as const,
          message: `Created Habit: "${newHabit.title}"`,
          timestamp: new Date().toISOString()
        },
        ...state.activities
      ];
      return { habits: [newHabit, ...state.habits], activities: newActivities.slice(0, 50) };
    });
  },

  updateHabit: (habitId, updates) => {
    set((state) => {
      const updatedHabits = state.habits.map(habit => {
        if (habit.id === habitId) {
          return { ...habit, ...updates, updatedAt: new Date().toISOString() };
        }
        return habit;
      });
      return { habits: updatedHabits };
    });
  },

  deleteHabit: (habitId) => {
    set((state) => {
      const habitToDelete = state.habits.find(h => h.id === habitId);
      const updatedHabits = state.habits.filter(h => h.id !== habitId);
      const newActivities = [...state.activities];
      
      if (habitToDelete) {
        newActivities.unshift({
          id: Date.now().toString(),
          type: 'habit' as const,
          message: `Deleted Habit: "${habitToDelete.title || habitToDelete.name}"`,
          timestamp: new Date().toISOString()
        });
      }
      
      return { habits: updatedHabits, activities: newActivities.slice(0, 50) };
    });
  },

  toggleHabit: (habitId) => {
    set((state) => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      let activityLogged = false;
      let habitName = '';

      const updatedHabits = state.habits.map(habit => {
        if (habit.id === habitId) {
          habitName = habit.title || (habit.name as string);
          
          if (habit.completedToday) {
            // Undo completion
            const datesCompleted = habit.datesCompleted.filter(d => d !== todayStr);
            let currentCount = Math.max(0, habit.currentCount - 1);
            let streak = habit.streak;
            if (habit.currentCount >= habit.targetCount) {
              streak = Math.max(0, habit.streak - 1);
            }

            return { 
              ...habit, 
              currentCount,
              completedToday: false,
              datesCompleted,
              streak,
              updatedAt: new Date().toISOString() 
            };
          } else {
            // Increment completion
            const currentCount = habit.currentCount + 1;
            let completedToday = false;
            let datesCompleted = [...habit.datesCompleted];
            let streak = habit.streak;
            let longestStreak = habit.longestStreak;

            if (currentCount >= habit.targetCount) {
              completedToday = true;
              activityLogged = true;
              if (!datesCompleted.includes(todayStr)) {
                datesCompleted.push(todayStr);
                if (habit.datesCompleted.includes(yesterdayStr)) {
                  streak += 1;
                } else if (!habit.datesCompleted.includes(todayStr)) {
                  streak = 1;
                }
                if (streak > longestStreak) {
                  longestStreak = streak;
                }
              }
            }

            return {
              ...habit,
              currentCount,
              completedToday,
              datesCompleted,
              streak,
              longestStreak,
              updatedAt: new Date().toISOString()
            };
          }
        }
        return habit;
      });

      const newActivities = [...state.activities];
      if (activityLogged) {
        newActivities.unshift({
          id: Date.now().toString(),
          type: 'habit' as const,
          message: `Completed Habit: "${habitName}"`,
          timestamp: new Date().toISOString()
        });
      }

      return { habits: updatedHabits, activities: newActivities.slice(0, 50) };
    });
  },

  resetDailyHabits: () => {
    set((state) => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      let hasChanges = false;
      
      const updatedHabits = state.habits.map(habit => {
        const wasCompletedToday = habit.datesCompleted.includes(todayStr);
        if (habit.completedToday && !wasCompletedToday) {
          hasChanges = true;
          return { ...habit, completedToday: false, currentCount: 0 };
        }
        if (!habit.completedToday && habit.currentCount > 0 && !wasCompletedToday) {
          hasChanges = true;
          return { ...habit, currentCount: 0 };
        }
        return habit;
      });

      if (!hasChanges) return state;
      return { habits: updatedHabits };
    });
  }
});
