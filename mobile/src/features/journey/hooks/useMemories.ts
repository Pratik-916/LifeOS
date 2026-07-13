import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { journeyApi } from '../api/journey';
import { journeyKeys } from '../api/journey.keys';
import type { MemoryFilters } from '../api/journey.types';

export const useMemories = (filters: MemoryFilters = {}) => {
  return useQuery({
    queryKey: journeyKeys.memoryList(filters),
    queryFn: () => journeyApi.getMemories(filters),
    placeholderData: keepPreviousData,
  });
};
