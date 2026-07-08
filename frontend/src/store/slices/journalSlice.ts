import type { StateCreator } from 'zustand';
import type { JournalEntry } from '../../types';
import type { AppState } from '../useAppStore';
import { initialJournalEntries } from '../../data/initialState';

export interface JournalSlice {
  journalEntries: JournalEntry[];
  addJournalEntry: (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJournalEntry: (entryId: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (entryId: string) => void;
  toggleJournalFavorite: (entryId: string) => void;
}

export const createJournalSlice: StateCreator<AppState, [], [], JournalSlice> = (set) => ({
  journalEntries: initialJournalEntries,
  
  addJournalEntry: (entryData) => {
    set((state) => {
      const newEntry: JournalEntry = {
        ...entryData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newActivities = [
        {
          id: Date.now().toString(),
          type: 'journal' as const,
          message: `Created Journal Entry: "${newEntry.title}"`,
          timestamp: new Date().toISOString()
        },
        ...state.activities
      ];
      return { journalEntries: [newEntry, ...state.journalEntries], activities: newActivities.slice(0, 50) };
    });
  },

  updateJournalEntry: (entryId, updates) => {
    set((state) => {
      const updatedEntries = state.journalEntries.map(entry => {
        if (entry.id === entryId) {
          return { ...entry, ...updates, updatedAt: new Date().toISOString() };
        }
        return entry;
      });
      return { journalEntries: updatedEntries };
    });
  },

  deleteJournalEntry: (entryId) => {
    set((state) => {
      const entryToDelete = state.journalEntries.find(j => j.id === entryId);
      const updatedEntries = state.journalEntries.filter(j => j.id !== entryId);
      const newActivities = [...state.activities];
      
      if (entryToDelete) {
        newActivities.unshift({
          id: Date.now().toString(),
          type: 'journal' as const,
          message: `Deleted Journal Entry: "${entryToDelete.title}"`,
          timestamp: new Date().toISOString()
        });
      }
      
      return { journalEntries: updatedEntries, activities: newActivities.slice(0, 50) };
    });
  },

  toggleJournalFavorite: (entryId) => {
    set((state) => {
      const updatedEntries = state.journalEntries.map(entry => {
        if (entry.id === entryId) {
          return { ...entry, favorite: !entry.favorite, updatedAt: new Date().toISOString() };
        }
        return entry;
      });
      return { journalEntries: updatedEntries };
    });
  }
});
