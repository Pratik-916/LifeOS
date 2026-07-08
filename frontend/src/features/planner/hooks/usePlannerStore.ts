import { create } from 'zustand';

interface PlannerState {
  isTaskModalOpen: boolean;
  selectedTaskId: string | null;
  searchQuery: string;
  setTaskModalOpen: (isOpen: boolean) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const usePlannerStore = create<PlannerState>((set) => ({
  isTaskModalOpen: false,
  selectedTaskId: null,
  searchQuery: '',
  setTaskModalOpen: (isOpen) => set({ isTaskModalOpen: isOpen }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
