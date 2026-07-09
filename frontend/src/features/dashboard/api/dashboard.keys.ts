export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  widgets: () => [...dashboardKeys.all, 'widgets'] as const,
  activity: () => [...dashboardKeys.all, 'activity'] as const,
  quickActions: () => [...dashboardKeys.all, 'quickActions'] as const,
};
