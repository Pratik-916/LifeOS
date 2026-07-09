import { axiosInstance } from '../../../api/axios';
import type { ActivityDTO, ActivityModel } from './dashboard.types';

export const mapActivityToDomain = (dto: ActivityDTO): ActivityModel => ({
  id: dto.id,
  action: dto.action,
  metadata: dto.metadata || {},
  createdAt: dto.created_at,
  contentType: dto.content_type,
  objectId: dto.object_id,
});

export const dashboardApi = {
  getRecentActivity: async (limit: number = 10) => {
    // The backend might not have this exposed at /activities/ yet,
    // but the requirement is to consume it. We'll handle 404s gracefully in the UI.
    try {
      const response = await axiosInstance.get<{ results: ActivityDTO[] }>('/activities/', {
        params: { limit }
      });
      return response.data.results.map(mapActivityToDomain);
    } catch (e: any) {
      if (e.response?.status === 404) {
        // Fallback gracefully if endpoint isn't wired yet
        console.warn('/activities/ endpoint not found. Returning empty array.');
        return [];
      }
      throw e;
    }
  }
};
