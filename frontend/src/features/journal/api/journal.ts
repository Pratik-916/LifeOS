import { axiosInstance } from '../../../api/axios';
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

export const JournalAPI = {
  getJournalEntries: async (filters: JournalFilters = {}) => {
    const { data } = await axiosInstance.get<PaginatedJournalDTO>('/journal/entries/', { params: filters });
    return mapPaginatedJournalToDomain(data);
  },

  getJournalEntry: async (id: string) => {
    const { data } = await axiosInstance.get<JournalEntryDTO>(`/journal/entries/${id}/`);
    return mapJournalEntryToDomain(data);
  },

  createJournalEntry: async (payload: CreateJournalEntryPayload) => {
    const { data } = await axiosInstance.post<JournalEntryDTO>('/journal/entries/', payload);
    return mapJournalEntryToDomain(data);
  },

  updateJournalEntry: async (id: string, payload: UpdateJournalEntryPayload) => {
    const { data } = await axiosInstance.patch<JournalEntryDTO>(`/journal/entries/${id}/`, payload);
    return mapJournalEntryToDomain(data);
  },

  deleteJournalEntry: async (id: string) => {
    await axiosInstance.delete(`/journal/entries/${id}/`);
  },

  restoreJournalEntry: async (id: string) => {
    const { data } = await axiosInstance.post<JournalEntryDTO>(`/journal/entries/${id}/restore/`);
    return mapJournalEntryToDomain(data);
  },

  favoriteJournalEntry: async (id: string) => {
    const { data } = await axiosInstance.post(`/journal/entries/${id}/favorite/`);
    return data;
  },

  pinJournalEntry: async (id: string) => {
    const { data } = await axiosInstance.post(`/journal/entries/${id}/pin/`);
    return data;
  },

  getJournalStatistics: async () => {
    const { data } = await axiosInstance.get<JournalStatsDTO>('/journal/entries/stats/');
    return mapJournalStatsToDomain(data);
  },

  bulkDelete: async (ids: string[]) => {
    await axiosInstance.post('/journal/entries/bulk-delete/', { ids });
  }
};
