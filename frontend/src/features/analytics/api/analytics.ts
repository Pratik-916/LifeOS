import { axiosInstance } from '../../../api/axios';
import type {
  DashboardSummaryDTO,
  PlannerAnalyticsDTO,
  GoalAnalyticsDTO,
  HabitAnalyticsDTO,
  JournalAnalyticsDTO,
  JourneyAnalyticsDTO,
  ProductivityAnalyticsDTO,
  TrendAnalyticsDTO,
  ChartDatasetDTO
} from './analytics.types';
import {
  mapDashboardSummaryToDomain,
  mapPlannerAnalyticsToDomain,
  mapGoalAnalyticsToDomain,
  mapHabitAnalyticsToDomain,
  mapJournalAnalyticsToDomain,
  mapJourneyAnalyticsToDomain,
  mapProductivityAnalyticsToDomain,
  mapTrendAnalyticsToDomain
} from './analytics.mapper';

export const AnalyticsAPI = {
  getDashboard: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get<DashboardSummaryDTO>('/analytics/dashboard/', { params: filters });
    return mapDashboardSummaryToDomain(data);
  },

  getOverview: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get<DashboardSummaryDTO>('/analytics/overview/', { params: filters });
    return mapDashboardSummaryToDomain(data);
  },

  getPlannerAnalytics: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get<PlannerAnalyticsDTO>('/analytics/planner/', { params: filters });
    return mapPlannerAnalyticsToDomain(data);
  },

  getGoalAnalytics: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get<GoalAnalyticsDTO>('/analytics/goals/', { params: filters });
    return mapGoalAnalyticsToDomain(data);
  },

  getHabitAnalytics: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get<HabitAnalyticsDTO>('/analytics/habits/', { params: filters });
    return mapHabitAnalyticsToDomain(data);
  },

  getJournalAnalytics: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get<JournalAnalyticsDTO>('/analytics/journal/', { params: filters });
    return mapJournalAnalyticsToDomain(data);
  },

  getJourneyAnalytics: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get<JourneyAnalyticsDTO>('/analytics/journey/', { params: filters });
    return mapJourneyAnalyticsToDomain(data);
  },

  getProductivityAnalytics: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get<ProductivityAnalyticsDTO>('/analytics/productivity/', { params: filters });
    return mapProductivityAnalyticsToDomain(data);
  },

  getHeatmap: async (filters?: Record<string, any>) => {
    // According to view, heatmap returns the habit_heatmap dictionary which we assume maps to a ChartDatasetDTO
    const { data } = await axiosInstance.get<ChartDatasetDTO>('/analytics/heatmap/', { params: filters });
    return data; 
  },

  getTrends: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get<TrendAnalyticsDTO>('/analytics/trends/', { params: filters });
    return mapTrendAnalyticsToDomain(data);
  },

  getWeeklyReport: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get('/analytics/weekly/', { params: filters });
    return data;
  },

  getMonthlyReport: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get('/analytics/monthly/', { params: filters });
    return data;
  },

  getYearlyReport: async (filters?: Record<string, any>) => {
    const { data } = await axiosInstance.get('/analytics/yearly/', { params: filters });
    return data;
  }
};
