import { useQuery } from '@tanstack/react-query';
import { JourneyAPI } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { MemoryFilters } from '../api/journey.types';

export const useMemories = (filters: MemoryFilters = {}) => {
  return useQuery({
    queryKey: journeyKeys.list(filters),
    queryFn: () => JourneyAPI.getMemories(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
