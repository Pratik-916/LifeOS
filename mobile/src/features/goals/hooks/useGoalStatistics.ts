import { useQuery } from '@tanstack/react-query';
import { goalsApi } from '../api/goals';
import { goalKeys } from '../api/goals.keys';

export const useGoalStatistics = () => {
  return useQuery({
    queryKey: goalKeys.statistics(),
    queryFn: () => goalsApi.getGoalStatistics(),
  });
};
