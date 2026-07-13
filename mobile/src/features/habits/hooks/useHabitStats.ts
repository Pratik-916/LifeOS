import { useQuery } from '@tanstack/react-query';
import { habitsApi } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';

export const useHabitStats = () => {
  return useQuery({
    queryKey: habitsKeys.statistics(),
    queryFn: () => habitsApi.getHabitStatistics(),
  });
};
