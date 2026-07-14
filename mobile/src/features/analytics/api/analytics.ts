import { apiClient } from '../../../api/client';
import type { 
  DashboardSummaryDTO, DashboardSummary,
  PlannerAnalyticsDTO, PlannerAnalytics,
  GoalAnalyticsDTO, GoalAnalytics,
  HabitAnalyticsDTO, HabitAnalytics,
  JournalAnalyticsDTO, JournalAnalytics,
  JourneyAnalyticsDTO, JourneyAnalytics,
  ProductivityAnalyticsDTO, ProductivityAnalytics,
  TrendAnalyticsDTO, TrendAnalytics,
  AnalyticsFilters
} from './analytics.types';
import { 
  mapDashboardSummary,
  mapPlannerAnalytics,
  mapGoalAnalytics,
  mapHabitAnalytics,
  mapJournalAnalytics,
  mapJourneyAnalytics,
  mapProductivityAnalytics,
  mapTrendAnalytics
} from './analytics.mapper';

const ANALYTICS_BASE_URL = '/analytics/';

const buildQueryParams = (filters?: AnalyticsFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters?.year) params.append('year', filters.year);
  if (filters?.month) params.append('month', filters.month);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.dateRange) params.append('date_range', filters.dateRange);
  return params;
};

export const analyticsService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummaryDTO>(`${ANALYTICS_BASE_URL}dashboard/`);
    return mapDashboardSummary(response.data);
  },

  async getPlannerAnalytics(filters?: AnalyticsFilters): Promise<PlannerAnalytics> {
    const params = buildQueryParams(filters);
    const response = await apiClient.get<PlannerAnalyticsDTO>(`${ANALYTICS_BASE_URL}planner/?${params.toString()}`);
    return mapPlannerAnalytics(response.data);
  },

  async getGoalAnalytics(filters?: AnalyticsFilters): Promise<GoalAnalytics> {
    const params = buildQueryParams(filters);
    const response = await apiClient.get<GoalAnalyticsDTO>(`${ANALYTICS_BASE_URL}goals/?${params.toString()}`);
    return mapGoalAnalytics(response.data);
  },

  async getHabitAnalytics(filters?: AnalyticsFilters): Promise<HabitAnalytics> {
    const params = buildQueryParams(filters);
    const response = await apiClient.get<HabitAnalyticsDTO>(`${ANALYTICS_BASE_URL}habits/?${params.toString()}`);
    return mapHabitAnalytics(response.data);
  },

  async getJournalAnalytics(filters?: AnalyticsFilters): Promise<JournalAnalytics> {
    const params = buildQueryParams(filters);
    const response = await apiClient.get<JournalAnalyticsDTO>(`${ANALYTICS_BASE_URL}journal/?${params.toString()}`);
    return mapJournalAnalytics(response.data);
  },

  async getJourneyAnalytics(filters?: AnalyticsFilters): Promise<JourneyAnalytics> {
    const params = buildQueryParams(filters);
    const response = await apiClient.get<JourneyAnalyticsDTO>(`${ANALYTICS_BASE_URL}journey/?${params.toString()}`);
    return mapJourneyAnalytics(response.data);
  },

  async getProductivityAnalytics(filters?: AnalyticsFilters): Promise<ProductivityAnalytics> {
    const params = buildQueryParams(filters);
    const response = await apiClient.get<ProductivityAnalyticsDTO>(`${ANALYTICS_BASE_URL}productivity/?${params.toString()}`);
    return mapProductivityAnalytics(response.data);
  },

  async getHeatmap(filters?: AnalyticsFilters): Promise<Record<string, unknown>> {
    const params = buildQueryParams(filters);
    const response = await apiClient.get<Record<string, unknown>>(`${ANALYTICS_BASE_URL}heatmap/?${params.toString()}`);
    return response.data;
  },

  async getTrends(): Promise<TrendAnalytics> {
    const response = await apiClient.get<TrendAnalyticsDTO>(`${ANALYTICS_BASE_URL}trends/`);
    return mapTrendAnalytics(response.data);
  },
};
