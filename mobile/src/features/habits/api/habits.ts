import { apiClient } from '../../../api/client';
import type { 
  HabitFilters, 
  CreateHabitPayload, 
  UpdateHabitPayload, 
  LogHabitPayload,
  PaginatedHabitsDTO,
  HabitDTO,
  HabitStatsDTO,
  HabitLogDTO
} from './habits.types';
import { 
  mapHabitToDomain, 
  mapPaginatedHabitsToDomain, 
  mapHabitStatsToDomain,
  mapHabitLogToDomain
} from './habits.mapper';

export const habitsApi = {
  getHabits: async (filters: HabitFilters = {}) => {
    // using the 'client' configured in the mobile foundation Phase 14
    const { data } = await apiClient.get<PaginatedHabitsDTO>('/habits/habits/', { params: filters });
    return mapPaginatedHabitsToDomain(data);
  },

  getHabit: async (id: string) => {
    const { data } = await apiClient.get<HabitDTO>(`/habits/habits/${id}/`);
    return mapHabitToDomain(data);
  },

  createHabit: async (payload: CreateHabitPayload) => {
    const { data } = await apiClient.post<HabitDTO>('/habits/habits/', payload);
    return mapHabitToDomain(data);
  },

  updateHabit: async (id: string, payload: UpdateHabitPayload) => {
    const { data } = await apiClient.patch<HabitDTO>(`/habits/habits/${id}/`, payload);
    return mapHabitToDomain(data);
  },

  deleteHabit: async (id: string) => {
    await apiClient.delete(`/habits/habits/${id}/`);
  },

  restoreHabit: async (id: string) => {
    const { data } = await apiClient.post<HabitDTO>(`/habits/habits/${id}/restore/`);
    return mapHabitToDomain(data);
  },

  archiveHabit: async (id: string) => {
    const { data } = await apiClient.patch<HabitDTO>(`/habits/habits/${id}/`, { is_archived: true, status: 'archived' });
    return mapHabitToDomain(data);
  },

  favoriteHabit: async (id: string, is_favorite: boolean) => {
    const { data } = await apiClient.patch<HabitDTO>(`/habits/habits/${id}/`, { is_favorite });
    return mapHabitToDomain(data);
  },

  logHabit: async (id: string, payload: LogHabitPayload) => {
    const { data } = await apiClient.post<HabitLogDTO>(`/habits/habits/${id}/log/`, payload);
    return mapHabitLogToDomain(data);
  },

  getHabitStatistics: async () => {
    const { data } = await apiClient.get<HabitStatsDTO>('/habits/habits/stats/');
    return mapHabitStatsToDomain(data);
  },
};
