import { apiClient } from '../../../api/client';
import type { 
  PaginatedResponse, 
  Memory, MemoryDTO,
  TimelineYearGroup,
  JourneyStatistics, JourneyStatisticsDTO,
  CreateMemoryPayload, UpdateMemoryPayload
} from './journey.types';
import { 
  mapMemoryDTO, 
  mapTimelineYearGroupDTO, 
  mapJourneyStatisticsDTO,
  mapCreateMemoryPayload,
  mapUpdateMemoryPayload
} from './journey.mapper';

const MEMORIES_BASE_URL = '/api/v1/journey/memories/';

export interface GetMemoriesFilters {
  category?: string;
  visibility?: string;
  favorite?: boolean;
  pinned?: boolean;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
}

export interface GetTimelineFilters {
  year?: number;
  month?: number;
  offset?: number;
  limit?: number;
}

export const journeyApi = {
  getMemories: async (filters?: GetMemoriesFilters): Promise<PaginatedResponse<Memory>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && key !== 'sort_by' && key !== 'sort_order' && key !== 'search') {
          params.append(key, String(value));
        }
      });
      if (filters.search) params.append('search', filters.search);
      if (filters.sort_by) {
        const prefix = filters.sort_order === 'desc' ? '-' : '';
        params.append('ordering', `${prefix}${filters.sort_by}`);
      }
      if (filters.page) params.append('page', String(filters.page));
    }

    const response = await apiClient.get<PaginatedResponse<MemoryDTO>>(`${MEMORIES_BASE_URL}?${params.toString()}`);
    
    const data = response.data.results ? response.data : {
      count: Array.isArray(response.data) ? response.data.length : 0,
      next: null,
      previous: null,
      results: Array.isArray(response.data) ? response.data : []
    };

    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: data.results.map(mapMemoryDTO)
    };
  },

  getMemory: async (id: string): Promise<Memory> => {
    const response = await apiClient.get<MemoryDTO>(`${MEMORIES_BASE_URL}${id}/`);
    return mapMemoryDTO(response.data);
  },

  createMemory: async (payload: CreateMemoryPayload): Promise<Memory> => {
    const dtoPayload = mapCreateMemoryPayload(payload);
    const response = await apiClient.post<MemoryDTO>(MEMORIES_BASE_URL, dtoPayload);
    return mapMemoryDTO(response.data);
  },

  updateMemory: async (id: string, payload: UpdateMemoryPayload): Promise<Memory> => {
    const dtoPayload = mapUpdateMemoryPayload(payload);
    const response = await apiClient.patch<MemoryDTO>(`${MEMORIES_BASE_URL}${id}/`, dtoPayload);
    return mapMemoryDTO(response.data);
  },

  deleteMemory: async (id: string): Promise<void> => {
    await apiClient.delete(`${MEMORIES_BASE_URL}${id}/`);
  },

  restoreMemory: async (id: string): Promise<Memory> => {
    const response = await apiClient.post<MemoryDTO>(`${MEMORIES_BASE_URL}${id}/restore/`);
    return mapMemoryDTO(response.data);
  },

  favoriteMemory: async (id: string): Promise<{ status: string; favorite: boolean }> => {
    const response = await apiClient.post(`${MEMORIES_BASE_URL}${id}/favorite/`);
    return response.data;
  },

  pinMemory: async (id: string): Promise<{ status: string; pinned: boolean }> => {
    const response = await apiClient.post(`${MEMORIES_BASE_URL}${id}/pin/`);
    return response.data;
  },

  getTimeline: async (filters?: GetTimelineFilters): Promise<PaginatedResponse<TimelineYearGroup>> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.offset !== undefined) params.append('offset', String(filters.offset));
      if (filters.limit !== undefined) params.append('limit', String(filters.limit));
      if (filters.year !== undefined) params.append('year', String(filters.year));
      if (filters.month !== undefined) params.append('month', String(filters.month));
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient.get<any>(`${MEMORIES_BASE_URL}timeline/?${params.toString()}`);
    return {
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: (response.data.results || []).map(mapTimelineYearGroupDTO)
    };
  },

  getStatistics: async (): Promise<JourneyStatistics> => {
    const response = await apiClient.get<JourneyStatisticsDTO>(`${MEMORIES_BASE_URL}stats/`);
    return mapJourneyStatisticsDTO(response.data);
  },
};
