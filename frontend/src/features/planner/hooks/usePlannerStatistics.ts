import { useQuery } from '@tanstack/react-query';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';
import type { PlannerStats } from '../api/planner.types';

export const usePlannerStatistics = () => {
  return useQuery<PlannerStats, Error>({
    queryKey: plannerKeys.statistics(),
    queryFn: () => plannerApi.getStatistics(),
    staleTime: 10 * 1000, // 10 seconds per requirements
  });
};
