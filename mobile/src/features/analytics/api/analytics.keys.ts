import type { AnalyticsFilters } from './analytics.types';

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  planner: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'planner', { filters }] as const,
  goals: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'goals', { filters }] as const,
  habits: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'habits', { filters }] as const,
  journal: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'journal', { filters }] as const,
  journey: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'journey', { filters }] as const,
  productivity: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'productivity', { filters }] as const,
  heatmap: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'heatmap', { filters }] as const,
  trends: () => [...analyticsKeys.all, 'trends'] as const,
};
