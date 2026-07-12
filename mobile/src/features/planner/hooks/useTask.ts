import { useQuery } from '@tanstack/react-query';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';

export const useTask = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: plannerKeys.task(id),
    queryFn: () => plannerApi.getTask(id),
    enabled: options?.enabled,
  });
};
