import { axiosInstance } from '../../../api/axios';
import { mapGoalFromDTO } from './goals.mapper';
import type { GoalDTO, GoalStatsDTO, GetGoalsFilters, CreateGoalPayload, UpdateGoalPayload } from './goals.types';
import type { Goal, PaginatedResponse } from '../../../types';

class GoalsAPI {
  async getGoals(filters: GetGoalsFilters = {}): Promise<PaginatedResponse<Goal>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.category) params.append('category', filters.category);
    if (filters.is_favorite !== undefined) params.append('is_favorite', filters.is_favorite.toString());
    if (filters.is_archived !== undefined) params.append('is_archived', filters.is_archived.toString());
    if (filters.search) params.append('search', filters.search);
    
    if (filters.sort_by) {
      const prefix = filters.sort_order === 'desc' ? '-' : '';
      params.append('ordering', `${prefix}${filters.sort_by}`);
    }

    const { data } = await axiosInstance.get<PaginatedResponse<GoalDTO> | GoalDTO[]>(`/goals/goals/?${params.toString()}`);
    
    // Check if the backend returned an array directly instead of a PaginatedResponse
    if (Array.isArray(data)) {
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data.map(mapGoalFromDTO)
      };
    }
    
    return {
      ...data,
      results: (data.results || []).map(mapGoalFromDTO)
    };
  }

  async getGoal(id: string): Promise<Goal> {
    const { data } = await axiosInstance.get<GoalDTO>(`/goals/goals/${id}/`);
    return mapGoalFromDTO(data);
  }

  async getGoalProgress(id: string): Promise<number> {
    // Relying on the detail endpoint which calculates progress in backend
    const { data } = await axiosInstance.get<GoalDTO>(`/goals/goals/${id}/`);
    return data.progress;
  }

  async createGoal(payload: CreateGoalPayload): Promise<Goal> {
    const { data } = await axiosInstance.post<GoalDTO>('/goals/goals/', payload);
    return mapGoalFromDTO(data);
  }

  async updateGoal(id: string, payload: UpdateGoalPayload): Promise<Goal> {
    const { data } = await axiosInstance.patch<GoalDTO>(`/goals/goals/${id}/`, payload);
    return mapGoalFromDTO(data);
  }

  async deleteGoal(id: string): Promise<void> {
    await axiosInstance.delete(`/goals/goals/${id}/`);
  }

  async restoreGoal(id: string): Promise<void> {
    await axiosInstance.post(`/goals/goals/${id}/restore/`);
  }

  async archiveGoal(id: string): Promise<Goal> {
    return this.updateGoal(id, { is_archived: true });
  }

  async completeGoal(id: string): Promise<Goal> {
    return this.updateGoal(id, { status: 'completed' });
  }

  async favoriteGoal(id: string, isFavorite: boolean): Promise<Goal> {
    const { data } = await axiosInstance.post(`/goals/goals/${id}/favorite/`, { is_favorite: isFavorite });
    return mapGoalFromDTO(data);
  }

  async pinGoal(id: string, isPinned: boolean): Promise<Goal> {
    // Assuming 'pin' equates to 'favorite' for the UI currently, or backend equivalent
    return this.favoriteGoal(id, isPinned);
  }

  async getGoalStatistics(): Promise<GoalStatsDTO> {
    const { data } = await axiosInstance.get<GoalStatsDTO>('/goals/goals/stats/');
    return data;
  }

  async bulkComplete(ids: string[]): Promise<void> {
    await axiosInstance.post('/goals/goals/bulk-complete/', { ids });
  }

  async bulkArchive(ids: string[]): Promise<void> {
    await axiosInstance.post('/goals/bulk-archive/', { ids });
  }

  async bulkDelete(ids: string[]): Promise<void> {
    await axiosInstance.post('/goals/bulk-delete/', { ids });
  }
}

export const goalsApi = new GoalsAPI();
