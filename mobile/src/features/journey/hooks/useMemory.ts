import { useQuery } from '@tanstack/react-query';
import { journeyApi } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';

export const useMemory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: journeyKeys.memory(id),
    queryFn: () => journeyApi.getMemory(id),
    enabled: enabled && !!id,
  });
};
