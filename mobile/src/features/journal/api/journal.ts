import { apiClient } from '../../../api/client';
import type { 
  JournalFilters, 
  CreateJournalEntryPayload, 
  UpdateJournalEntryPayload,
  PaginatedJournalDTO,
  JournalEntryDTO,
  JournalStatsDTO
} from './journal.types';
import { 
  mapJournalEntryToDomain, 
  mapPaginatedJournalToDomain, 
  mapJournalStatsToDomain 
} from './journal.mapper';

export const journalApi = {
  getJournalEntries: async (filters: JournalFilters = {}) => {
    const { data } = await apiClient.get<PaginatedJournalDTO>('/journal/entries/', { params: filters });
    return mapPaginatedJournalToDomain(data);
  },

  getJournalEntry: async (id: string) => {
    const { data } = await apiClient.get<JournalEntryDTO>(`/journal/entries/${id}/`);
    return mapJournalEntryToDomain(data);
  },

  createJournalEntry: async (payload: CreateJournalEntryPayload) => {
    const { data } = await apiClient.post<JournalEntryDTO>('/journal/entries/', payload);
    return mapJournalEntryToDomain(data);
  },

  updateJournalEntry: async (id: string, payload: UpdateJournalEntryPayload) => {
    const { data } = await apiClient.patch<JournalEntryDTO>(`/journal/entries/${id}/`, payload);
    return mapJournalEntryToDomain(data);
  },

  deleteJournalEntry: async (id: string) => {
    await apiClient.delete(`/journal/entries/${id}/`);
  },

  restoreJournalEntry: async (id: string) => {
    const { data } = await apiClient.post<JournalEntryDTO>(`/journal/entries/${id}/restore/`);
    return mapJournalEntryToDomain(data);
  },

  favoriteJournalEntry: async (id: string) => {
    const { data } = await apiClient.post(`/journal/entries/${id}/favorite/`);
    return data;
  },

  pinJournalEntry: async (id: string) => {
    const { data } = await apiClient.post(`/journal/entries/${id}/pin/`);
    return data;
  },

  getJournalStatistics: async () => {
    const { data } = await apiClient.get<JournalStatsDTO>('/journal/entries/stats/');
    return mapJournalStatsToDomain(data);
  },
};
