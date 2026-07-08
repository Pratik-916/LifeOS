import type { StateCreator } from 'zustand';
import type { Memory } from '../../types';
import type { AppState } from '../useAppStore';
import { initialMemories } from '../../data/initialState';

export interface MemorySlice {
  memories: Memory[];
  addMemory: (memoryData: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMemory: (memoryId: string, updates: Partial<Memory>) => void;
  deleteMemory: (memoryId: string) => void;
  toggleMemoryFavorite: (memoryId: string) => void;
}

export const createMemorySlice: StateCreator<AppState, [], [], MemorySlice> = (set) => ({
  memories: initialMemories || [],
  
  addMemory: (memoryData) => {
    set((state) => {
      const newMemory: Memory = {
        ...memoryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return { memories: [newMemory, ...state.memories] };
    });
  },
  
  updateMemory: (memoryId, updates) => {
    set((state) => ({
      memories: state.memories.map((memory) => 
        memory.id === memoryId 
          ? { ...memory, ...updates, updatedAt: new Date().toISOString() } 
          : memory
      ),
    }));
  },
  
  deleteMemory: (memoryId) => {
    set((state) => ({
      memories: state.memories.filter((memory) => memory.id !== memoryId),
    }));
  },
  
  toggleMemoryFavorite: (memoryId) => {
    set((state) => ({
      memories: state.memories.map((memory) => 
        memory.id === memoryId 
          ? { ...memory, favorite: !memory.favorite, updatedAt: new Date().toISOString() } 
          : memory
      ),
    }));
  },
});
