import type { Task, Habit, Goal, Activity, JournalEntry, Memory } from '../types';

export const useStubData = () => {
  return {
    tasks: [] as Task[],
    addTask: (t: any) => {},
    updateTask: (id: string, updates: any) => {},
    deleteTask: (id: string) => {},
    toggleTask: (id: string) => {},

    habits: [] as Habit[],
    addHabit: (h: any) => {},
    updateHabit: (id: string, updates: any) => {},
    deleteHabit: (id: string) => {},
    toggleHabit: (id: string) => {},

    goals: [] as Goal[],
    addGoal: (g: any) => {},
    updateGoal: (id: string, updates: any) => {},
    deleteGoal: (id: string) => {},
    toggleMilestone: (gId: string, mId: string) => {},
    addMilestone: (gId: string, title: string) => {},
    deleteMilestone: (gId: string, mId: string) => {},

    journalEntries: [] as JournalEntry[],
    addJournalEntry: (j: any) => {},
    updateJournalEntry: (id: string, updates: any) => {},
    deleteJournalEntry: (id: string) => {},
    toggleJournalFavorite: (id: string) => {},

    activities: [] as Activity[],
    
    memories: [] as Memory[],
    addMemory: (m: any) => {},
    updateMemory: (id: string, updates: any) => {},
    deleteMemory: (id: string) => {},
    toggleMemoryFavorite: (id: string) => {},
  };
};
