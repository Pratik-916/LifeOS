import { apiClient } from '../../../api/client';
import type { 
  MemoryFilters,
  TimelineFilters,
  CreateMemoryPayload, 
  UpdateMemoryPayload,
  PaginatedMemoryDTO,
  MemoryDTO,
  PaginatedTimelineDTO,
  JourneyStatsDTO,
  MemoryModel,
  PaginatedMemoryModel,
  PaginatedTimelineModel,
  JourneyStatsModel
} from './journey.types';
import { 
  mapMemoryToDomain, 
  mapPaginatedMemoryToDomain,
  mapPaginatedTimelineToDomain,
  mapJourneyStatsToDomain 
} from './journey.mapper';

export const journeyApi = {
  getMemories: async (filters: MemoryFilters = {}): Promise<PaginatedMemoryModel> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    
    const { data } = await apiClient.get<PaginatedMemoryDTO>(`/journey/memories/?${params.toString()}`);
    return mapPaginatedMemoryToDomain(data);
  },

  getMemory: async (id: string): Promise<MemoryModel> => {
    const { data } = await apiClient.get<MemoryDTO>(`/journey/memories/${id}/`);
    return mapMemoryToDomain(data);
  },

  createMemory: async (payload: CreateMemoryPayload): Promise<MemoryModel> => {
    const { data } = await apiClient.post<MemoryDTO>('/journey/memories/', payload);
    return mapMemoryToDomain(data);
  },

  updateMemory: async (id: string, payload: UpdateMemoryPayload): Promise<MemoryModel> => {
    const { data } = await apiClient.patch<MemoryDTO>(`/journey/memories/${id}/`, payload);
    return mapMemoryToDomain(data);
  },

  deleteMemory: async (id: string): Promise<void> => {
    await apiClient.delete(`/journey/memories/${id}/`);
  },

  restoreMemory: async (id: string): Promise<MemoryModel> => {
    const { data } = await apiClient.post<MemoryDTO>(`/journey/memories/${id}/restore/`);
    return mapMemoryToDomain(data);
  },

  favoriteMemory: async (id: string): Promise<{status: string, favorite: boolean}> => {
    const { data } = await apiClient.post<{status: string, favorite: boolean}>(`/journey/memories/${id}/favorite/`);
    return data;
  },

  pinMemory: async (id: string): Promise<{status: string, pinned: boolean}> => {
    const { data } = await apiClient.post<{status: string, pinned: boolean}>(`/journey/memories/${id}/pin/`);
    return data;
  },

  getJourneyTimeline: async (filters: TimelineFilters = {}): Promise<PaginatedTimelineModel> => {
    let url = '/journey/memories/timeline/';
    if (filters.year && filters.month) {
      url = `/journey/memories/timeline/${filters.year}/${filters.month}/`;
    } else if (filters.year) {
      url = `/journey/memories/timeline/${filters.year}/`;
    }
    
    const params = new URLSearchParams();
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.offset) params.append('offset', String(filters.offset));
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const { data } = await apiClient.get<PaginatedTimelineDTO>(`${url}${queryString}`);
    
    return mapPaginatedTimelineToDomain(data);
  },

  getJourneyStatistics: async (): Promise<JourneyStatsModel> => {
    const { data } = await apiClient.get<JourneyStatsDTO>('/journey/memories/stats/');
    return mapJourneyStatsToDomain(data);
  },

  // Image support placeholder
  uploadMemoryImages: async (id: string, formData: FormData): Promise<MemoryModel> => {
    // Note: react-native needs special handling for FormData over typical web usage
    // For now, this points to the backend which expects multipart/form-data
    const { data } = await apiClient.post<MemoryDTO>(`/journey/memories/${id}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return mapMemoryToDomain(data);
  },

  deleteMemoryImage: async (id: string, imageId: string): Promise<void> => {
    await apiClient.delete(`/journey/memories/${id}/images/${imageId}/`);
  }
};
