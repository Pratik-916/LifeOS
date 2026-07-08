import type { StateCreator } from 'zustand';
import type { Task } from '../../types';
import type { AppState } from '../useAppStore';
import { initialTasks } from '../../data/initialState';

export interface TaskSlice {
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTask: (taskId: string) => void;
}

export const createTaskSlice: StateCreator<AppState, [], [], TaskSlice> = (set) => ({
  tasks: initialTasks,

  
  addTask: (taskData) => {
    set((state) => {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newActivities = [
        {
          id: Date.now().toString(),
          type: 'task' as const,
          message: `Created Task: "${newTask.title}"`,
          timestamp: new Date().toISOString()
        },
        ...state.activities
      ];
      return { tasks: [newTask, ...state.tasks], activities: newActivities.slice(0, 50) };
    });
  },

  updateTask: (taskId, updates) => {
    set((state) => {
      const updatedTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, ...updates, updatedAt: new Date().toISOString() };
        }
        return task;
      });
      return { tasks: updatedTasks };
    });
  },

  deleteTask: (taskId) => {
    set((state) => {
      const taskToDelete = state.tasks.find(t => t.id === taskId);
      const updatedTasks = state.tasks.filter(t => t.id !== taskId);
      const newActivities = [...state.activities];
      
      if (taskToDelete) {
        newActivities.unshift({
          id: Date.now().toString(),
          type: 'task' as const,
          message: `Deleted Task: "${taskToDelete.title}"`,
          timestamp: new Date().toISOString()
        });
      }
      
      return { tasks: updatedTasks, activities: newActivities.slice(0, 50) };
    });
  },

  toggleTask: (taskId) => {
    set((state) => {
      let taskName = '';
      let isCompleting = false;
      const updatedTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          taskName = task.title;
          isCompleting = task.status !== 'done';
          return { 
            ...task, 
            status: (task.status === 'done' ? 'todo' : 'done') as 'todo' | 'done',
            completedAt: task.status !== 'done' ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      });

      const newActivities = [...state.activities];
      if (isCompleting && taskName) {
        newActivities.unshift({
          id: Date.now().toString(),
          type: 'task' as const,
          message: `Completed Task: "${taskName}"`,
          timestamp: new Date().toISOString()
        });
      }

      return { tasks: updatedTasks, activities: newActivities.slice(0, 50) };
    });
  }
});
