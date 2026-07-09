import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '../api/dashboard.keys';
import type { DashboardWidgetConfig } from '../api/dashboard.types';

// Future Personalization: This could eventually be fetched from the backend user preferences
const defaultWidgets: DashboardWidgetConfig[] = [
  { id: 'productivity', title: 'Productivity', type: 'analytics', order: 0, isVisible: true, size: 'medium' },
  { id: 'upcoming_tasks', title: 'Upcoming Tasks', type: 'planner', order: 1, isVisible: true, size: 'large' },
  { id: 'habits', title: 'Today\'s Habits', type: 'habits', order: 2, isVisible: true, size: 'medium' },
  { id: 'goals', title: 'Active Goals', type: 'goals', order: 3, isVisible: true, size: 'medium' },
  { id: 'journal', title: 'Latest Journal', type: 'journal', order: 4, isVisible: true, size: 'small' },
  { id: 'journey', title: 'Journey Highlights', type: 'journey', order: 5, isVisible: true, size: 'small' },
  { id: 'blog', title: 'Recent Blog Posts', type: 'blog', order: 6, isVisible: true, size: 'large' },
];

export const useDashboardWidgets = () => {
  return useQuery({
    queryKey: dashboardKeys.widgets(),
    queryFn: async () => {
      // Stub for future backend personalization
      return defaultWidgets.sort((a, b) => a.order - b.order);
    },
    staleTime: Infinity, // Static for now until personalization is implemented
  });
};
