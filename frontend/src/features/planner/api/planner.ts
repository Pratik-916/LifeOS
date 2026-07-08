import { apiClient } from '../../../api/client';
import type { 
  Task, 
  TaskDTO, 
  PlannerStats, 
  PlannerStatsDTO, 
  CreateTaskPayload, 
  UpdateTaskPayload 
} from './planner.types';
import { mapTaskDTO, mapPlannerStatsDTO, mapTaskToDTO } from './planner.mapper';

const BASE_URL = '/planner/tasks/';

export interface GetTasksFilters {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  is_archived?: boolean;
  is_pinned?: boolean;
  is_recurring?: boolean;
}

export const plannerApi = {
  getTasks: async (filters?: GetTasksFilters): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    // Support filtering on backend search param
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await apiClient.get<TaskDTO[]>(`${BASE_URL}?${params.toString()}`);
    // The interceptor unwraps {success, data} so response.data is TaskDTO[]
    // Wait, the backend uses ModelViewSet without pagination or with pagination?
    // If pagination is enabled, response.data could be { count, next, previous, results }
    // LifeOS standard wrapper handles it if we don't have DRF pagination configured to override.
    // Assuming it returns an array of objects directly inside data.
    const data = Array.isArray(response.data) ? response.data : (response.data as any).results || [];
    return data.map(mapTaskDTO);
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
