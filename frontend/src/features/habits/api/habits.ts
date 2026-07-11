import { axiosInstance } from '../../../api/axios';
import type { HabitFilters, 
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

export const HabitsAPI = {
  getHabits: async (filters: HabitFilters = {}) => {
    const { data } = await axiosInstance.get<PaginatedHabitsDTO>('/habits/habits/', { params: filters });
    return mapPaginatedHabitsToDomain(data);
  },

  getHabit: async (id: string) => {
    const { data } = await axiosInstance.get<HabitDTO>(`/habits/habits/${id}/`);
    return mapHabitToDomain(data);
  },

  createHabit: async (payload: CreateHabitPayload) => {
    const { data } = await axiosInstance.post<HabitDTO>('/habits/habits/', payload);
    return mapHabitToDomain(data);
  },

  updateHabit: async (id: string, payload: UpdateHabitPayload) => {
    const { data } = await axiosInstance.patch<HabitDTO>(`/habits/habits/${id}/`, payload);
    return mapHabitToDomain(data);
  },

  deleteHabit: async (id: string) => {
    await axiosInstance.delete(`/habits/habits/${id}/`);
  },

  restoreHabit: async (id: string) => {
    const { data } = await axiosInstance.post<HabitDTO>(`/habits/habits/${id}/restore/`);
    return mapHabitToDomain(data);
  },

  archiveHabit: async (id: string) => {
    const { data } = await axiosInstance.patch<HabitDTO>(`/habits/habits/${id}/`, { is_archived: true, status: 'archived' });
    return mapHabitToDomain(data);
  },

  favoriteHabit: async (id: string, is_favorite: boolean) => {
    const { data } = await axiosInstance.patch<HabitDTO>(`/habits/habits/${id}/`, { is_favorite });
    return mapHabitToDomain(data);
  },

  logHabit: async (id: string, payload: LogHabitPayload) => {
    const { data } = await axiosInstance.post<HabitLogDTO>(`/habits/habits/${id}/log/`, payload);
    return mapHabitLogToDomain(data);
  },

  getHabitStatistics: async () => {
    const { data } = await axiosInstance.get<HabitStatsDTO>('/habits/habits/stats/');
    return mapHabitStatsToDomain(data);
  },

  bulkArchive: async (ids: string[]) => {
    await axiosInstance.post('/habits/habits/bulk-archive/', { ids });
  },

  bulkDelete: async (ids: string[]) => {
    await axiosInstance.post('/habits/bulk-delete/', { ids });
  },
  
  bulkPause: async (ids: string[]) => {
    await axiosInstance.post('/habits/bulk-pause/', { ids });
  },
  
  bulkResume: async (ids: string[]) => {
    await axiosInstance.post('/habits/bulk-resume/', { ids });
  }
};
