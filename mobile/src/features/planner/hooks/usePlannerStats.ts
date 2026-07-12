import { useQuery } from '@tanstack/react-query';
import { plannerApi } from '../api/planner';
import { plannerKeys } from '../api/planner.keys';

export const usePlannerStats = () => {
  return useQuery({
    queryKey: plannerKeys.statistics(),
    queryFn: () => plannerApi.getStatistics(),
  });
};
