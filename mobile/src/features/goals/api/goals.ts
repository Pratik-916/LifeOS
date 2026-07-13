import { apiClient } from '../../../api/client';
import { mapGoalFromDTO } from './goals.mapper';
import type { GoalDTO, GoalStatsDTO, GetGoalsFilters, CreateGoalPayload, UpdateGoalPayload, Goal, PaginatedResponse } from './goals.types';

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

    const { data } = await apiClient.get<PaginatedResponse<GoalDTO> | GoalDTO[]>(`/goals/goals/?${params.toString()}`);
    
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
    const { data } = await apiClient.get<GoalDTO>(`/goals/goals/${id}/`);
    return mapGoalFromDTO(data);
  }

  async createGoal(payload: CreateGoalPayload): Promise<Goal> {
    const { data } = await apiClient.post<GoalDTO>('/goals/goals/', payload);
    return mapGoalFromDTO(data);
  }

  async updateGoal(id: string, payload: UpdateGoalPayload): Promise<Goal> {
    const { data } = await apiClient.patch<GoalDTO>(`/goals/goals/${id}/`, payload);
    return mapGoalFromDTO(data);
  }

  async deleteGoal(id: string): Promise<void> {
    await apiClient.delete(`/goals/goals/${id}/`);
  }

  async archiveGoal(id: string): Promise<Goal> {
    return this.updateGoal(id, { is_archived: true });
  }

  async restoreGoal(id: string): Promise<void> {
    await apiClient.post(`/goals/goals/${id}/restore/`);
  }

  async favoriteGoal(id: string, isFavorite: boolean): Promise<Goal> {
    const { data } = await apiClient.post(`/goals/goals/${id}/favorite/`, { is_favorite: isFavorite });
    return mapGoalFromDTO(data);
  }

  async getGoalStatistics(): Promise<GoalStatsDTO> {
    const { data } = await apiClient.get<GoalStatsDTO>('/goals/goals/stats/');
    return data;
  }
}

export const goalsApi = new GoalsAPI();
