import { useQuery } from '@tanstack/react-query';
import { plannerApi, GetTasksFilters } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';

export const useTasks = (filters?: GetTasksFilters) => {
  return useQuery({
    queryKey: plannerKeys.tasksList(filters),
    queryFn: () => plannerApi.getTasks(filters),
    placeholderData: (previousData) => previousData,
  });
};
