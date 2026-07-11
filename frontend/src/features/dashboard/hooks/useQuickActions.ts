import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '../api/dashboard.keys';
import type { QuickActionConfig } from '../api/dashboard.types';

const defaultQuickActions: QuickActionConfig[] = [
  { id: 'new_task', label: 'New Task', icon: 'CheckSquare', path: '/planner?action=create', color: 'bg-accent/10 text-accent' },
  { id: 'new_goal', label: 'New Goal', icon: 'Target', path: '/goals?action=create', color: 'bg-purple-500/10 text-purple-500' },
  { id: 'new_habit', label: 'New Habit', icon: 'Repeat', path: '/habits?action=create', color: 'bg-orange-500/10 text-orange-500' },
  { id: 'new_journal', label: 'New Journal Entry', icon: 'PenTool', path: '/journal?action=create', color: 'bg-pink-500/10 text-pink-500' },
  { id: 'new_memory', label: 'New Memory', icon: 'Image', path: '/journey?action=create', color: 'bg-blue-400/10 text-blue-400' },
  { id: 'new_blog', label: 'New Blog Post', icon: 'Edit3', path: '/blog/admin?action=create', color: 'bg-green-500/10 text-green-500' },
];

export const useQuickActions = () => {
  return useQuery({
    queryKey: dashboardKeys.quickActions(),
    queryFn: async () => {
      return defaultQuickActions;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes as per requirements
  });
};
