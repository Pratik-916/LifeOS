import { apiClient } from '../../../api/client';
import type { PaginatedResponse, Task, TaskDTO, PlannerStats, PlannerStatsDTO } from './planner.types';
import { mapTaskDTO, mapPlannerStatsDTO, mapTaskToDTO } from './planner.mapper';

const BASE_URL = '/api/v1/planner/tasks/';

export interface GetTasksFilters {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  is_archived?: boolean;
  is_pinned?: boolean;
  is_recurring?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
}

export const plannerApi = {
  getTasks: async (filters?: GetTasksFilters): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && key !== 'sort_by' && key !== 'sort_order' && key !== 'search') {
          params.append(key, String(value));
        }
      });
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.sort_by) {
        const prefix = filters.sort_order === 'desc' ? '-' : '';
        params.append('ordering', `${prefix}${filters.sort_by}`);
      }

      if (filters.page) {
        params.append('page', String(filters.page));
      }
    }

    const response = await apiClient.get<unknown>(`${BASE_URL}?${params.toString()}`);
    
    // Handle DRF paginated response
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
      results: data.results.map(mapTaskDTO)
    };
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await apiClient.get<TaskDTO>(`${BASE_URL}${id}/`);
    return mapTaskDTO(response.data);
  },

  createTask: async (payload: Partial<Task>): Promise<Task> => {
    const dtoPayload = mapTaskToDTO(payload);
    const response = await apiClient.post<TaskDTO>(BASE_URL, dtoPayload);
    return mapTaskDTO(response.data);
  },

  updateTask: async (id: string, payload: Partial<Task>): Promise<Task> => {
    const dtoPayload = mapTaskToDTO(payload);
    const response = await apiClient.patch<TaskDTO>(`${BASE_URL}${id}/`, dtoPayload);
    return mapTaskDTO(response.data);
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}${id}/`);
  },

  restoreTask: async (id: string): Promise<Task> => {
    const response = await apiClient.post<TaskDTO>(`${BASE_URL}${id}/restore/`);
    return mapTaskDTO(response.data);
  },

  completeTask: async (id: string, completed: boolean): Promise<Task> => {
    const status = completed ? 'completed' : 'todo';
    const response = await apiClient.patch<TaskDTO>(`${BASE_URL}${id}/`, { status });
    return mapTaskDTO(response.data);
  },

  getStatistics: async (): Promise<PlannerStats> => {
    const response = await apiClient.get<PlannerStatsDTO>(`${BASE_URL}stats/`);
    return mapPlannerStatsDTO(response.data);
  },
};
