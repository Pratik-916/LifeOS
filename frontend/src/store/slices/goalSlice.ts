import type { StateCreator } from 'zustand';
import type { Goal, Milestone } from '../../types';
import type { AppState } from '../useAppStore';
import { initialGoals } from '../../data/initialState';

export interface GoalSlice {
  goals: Goal[];
  addGoal: (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  addMilestone: (goalId: string, milestoneData: Omit<Milestone, 'id'>) => void;
  updateMilestone: (goalId: string, milestoneId: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
}

export const createGoalSlice: StateCreator<AppState, [], [], GoalSlice> = (set) => ({
  goals: initialGoals,
  
  addGoal: (goalData) => {
    set((state) => {
      const newGoal: Goal = {
        ...goalData,
        id: Date.now().toString(),
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newActivities = [
        {
          id: Date.now().toString(),
          type: 'goal' as const,
          message: `Created Goal: "${newGoal.title}"`,
          timestamp: new Date().toISOString()
        },
        ...state.activities
      ];
      return { goals: [newGoal, ...state.goals], activities: newActivities.slice(0, 50) };
    });
  },

  updateGoal: (goalId, updates) => {
    set((state) => {
      const updatedGoals = state.goals.map(goal => {
        if (goal.id === goalId) {
          return { ...goal, ...updates, updatedAt: new Date().toISOString() };
        }
        return goal;
      });
      return { goals: updatedGoals };
    });
  },

  deleteGoal: (goalId) => {
    set((state) => {
      const goalToDelete = state.goals.find(g => g.id === goalId);
      const updatedGoals = state.goals.filter(g => g.id !== goalId);
      const newActivities = [...state.activities];
      
      if (goalToDelete) {
        newActivities.unshift({
          id: Date.now().toString(),
          type: 'goal' as const,
          message: `Deleted Goal: "${goalToDelete.title}"`,
          timestamp: new Date().toISOString()
        });
      }
      
      return { goals: updatedGoals, activities: newActivities.slice(0, 50) };
    });
  },

  addMilestone: (goalId, milestoneData) => {
    set((state) => {
      const updatedGoals = state.goals.map(goal => {
        if (goal.id === goalId) {
          const newMilestone: Milestone = {
            ...milestoneData,
            id: Date.now().toString()
          };
          const newMilestones = [...goal.milestones, newMilestone];
          const completedCount = newMilestones.filter(m => m.completed).length;
          const progress = newMilestones.length > 0 ? Math.round((completedCount / newMilestones.length) * 100) : goal.progress;
          
          return { ...goal, milestones: newMilestones, progress, updatedAt: new Date().toISOString() };
        }
        return goal;
      });
      return { goals: updatedGoals };
    });
  },

  updateMilestone: (goalId, milestoneId, updates) => {
    set((state) => {
      const updatedGoals = state.goals.map(goal => {
        if (goal.id === goalId) {
          const newMilestones = goal.milestones.map(m => m.id === milestoneId ? { ...m, ...updates } : m);
          const completedCount = newMilestones.filter(m => m.completed).length;
          const progress = newMilestones.length > 0 ? Math.round((completedCount / newMilestones.length) * 100) : goal.progress;
          
          return { ...goal, milestones: newMilestones, progress, updatedAt: new Date().toISOString() };
        }
        return goal;
      });
      return { goals: updatedGoals };
    });
  },

  deleteMilestone: (goalId, milestoneId) => {
    set((state) => {
      const updatedGoals = state.goals.map(goal => {
        if (goal.id === goalId) {
          const newMilestones = goal.milestones.filter(m => m.id !== milestoneId);
          const progress = newMilestones.length > 0 ? Math.round((newMilestones.filter(m => m.completed).length / newMilestones.length) * 100) : goal.progress;
          return { ...goal, milestones: newMilestones, progress, updatedAt: new Date().toISOString() };
        }
        return goal;
      });
      return { goals: updatedGoals };
    });
  },

  toggleMilestone: (goalId, milestoneId) => {
    set((state) => {
      const updatedGoals = state.goals.map(goal => {
        if (goal.id === goalId) {
          const newMilestones = goal.milestones.map(m => {
            if (m.id === milestoneId) {
              return { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined };
            }
            return m;
          });
          const completedCount = newMilestones.filter(m => m.completed).length;
          const progress = newMilestones.length > 0 ? Math.round((completedCount / newMilestones.length) * 100) : goal.progress;
          
          return { ...goal, milestones: newMilestones, progress, updatedAt: new Date().toISOString() };
        }
        return goal;
      });
      return { goals: updatedGoals };
    });
  }
});
