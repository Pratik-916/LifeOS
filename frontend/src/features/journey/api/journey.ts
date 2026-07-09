import { axiosInstance } from '../../../api/axios';
import type { 
  MemoryFilters,
  TimelineFilters,
  CreateMemoryPayload, 
  UpdateMemoryPayload,
  PaginatedMemoryDTO,
  MemoryDTO,
  PaginatedTimelineDTO,
  JourneyStatsDTO
} from './journey.types';
import { 
  mapMemoryToDomain, 
  mapPaginatedMemoryToDomain,
  mapPaginatedTimelineToDomain,
  mapJourneyStatsToDomain 
} from './journey.mapper';

export const JourneyAPI = {
  getMemories: async (filters: MemoryFilters = {}) => {
    const { data } = await axiosInstance.get<PaginatedMemoryDTO>('/journey/memories/', { params: filters });
    return mapPaginatedMemoryToDomain(data);
  },

  getMemory: async (id: string) => {
    const { data } = await axiosInstance.get<MemoryDTO>(`/journey/memories/${id}/`);
    return mapMemoryToDomain(data);
  },

  createMemory: async (payload: CreateMemoryPayload) => {
    const { data } = await axiosInstance.post<MemoryDTO>('/journey/memories/', payload);
    return mapMemoryToDomain(data);
  },

  updateMemory: async (id: string, payload: UpdateMemoryPayload) => {
    const { data } = await axiosInstance.patch<MemoryDTO>(`/journey/memories/${id}/`, payload);
    return mapMemoryToDomain(data);
  },

  deleteMemory: async (id: string) => {
    await axiosInstance.delete(`/journey/memories/${id}/`);
  },

  restoreMemory: async (id: string) => {
    const { data } = await axiosInstance.post<MemoryDTO>(`/journey/memories/${id}/restore/`);
    return mapMemoryToDomain(data);
  },

  favoriteMemory: async (id: string) => {
    const { data } = await axiosInstance.post(`/journey/memories/${id}/favorite/`);
    return data;
  },

  pinMemory: async (id: string) => {
    const { data } = await axiosInstance.post(`/journey/memories/${id}/pin/`);
    return data;
  },

  getJourneyTimeline: async (filters: TimelineFilters = {}) => {
    let url = '/journey/memories/timeline/';
    if (filters.year && filters.month) {
      url = `/journey/memories/timeline/${filters.year}/${filters.month}/`;
    } else if (filters.year) {
      url = `/journey/memories/timeline/${filters.year}/`;
    }
    
    // Omit year and month from query params since they are in the path
    const params = { ...filters };
    delete params.year;
    delete params.month;
    
    const { data } = await axiosInstance.get<PaginatedTimelineDTO>(url, { params });
    return mapPaginatedTimelineToDomain(data);
  },

  getJourneyStatistics: async () => {
    const { data } = await axiosInstance.get<JourneyStatsDTO>('/journey/memories/stats/');
    return mapJourneyStatsToDomain(data);
  },

  uploadMemoryImages: async (id: string, formData: FormData) => {
    const { data } = await axiosInstance.post<MemoryDTO>(`/memories/${id}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return mapMemoryToDomain(data);
  },

  deleteMemoryImage: async (id: string, imageId: string) => {
    await axiosInstance.delete(`/memories/${id}/images/${imageId}/`);
  },

  bulkDelete: async (ids: string[]) => {
    await axiosInstance.post('/memories/bulk-delete/', { ids });
  }
};
