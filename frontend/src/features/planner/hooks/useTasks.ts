import { useQuery } from '@tanstack/react-query';
import { plannerApi, type GetTasksFilters } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';
import type { Task } from '../api/planner.types';

export const useTasks = (filters?: GetTasksFilters) => {
  return useQuery<Task[], Error>({
    queryKey: plannerKeys.tasksList(filters),
    queryFn: () => plannerApi.getTasks(filters),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTask = (id: string) => {
  return useQuery<Task, Error>({
    queryKey: plannerKeys.task(id),
    queryFn: () => plannerApi.getTask(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
};
