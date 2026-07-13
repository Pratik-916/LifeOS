import { useQuery } from '@tanstack/react-query';
import { habitsApi } from '../api/habits';
import { habitsKeys } from '../api/habits.keys';

export const useHabit = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: habitsKeys.detail(id),
    queryFn: () => habitsApi.getHabit(id),
    enabled: options?.enabled,
  });
};
