import { useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface FilterSortConfig<T> {
  data: T[];
  searchQuery: string;
  searchFields: (keyof T)[];
  filters?: {
    field: keyof T;
    value: string; // 'all' means ignore
  }[];
  sortBy?: string;
  sortConfig?: Record<string, (a: T, b: T) => number>;
}

export function useFilterSort<T>({
  data,
  searchQuery,
  searchFields,
  filters = [],
  sortBy,
  sortConfig
}: FilterSortConfig<T>): T[] {
  return useMemo(() => {
    let result = [...data];

    // 1. Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        return searchFields.some((field) => {
          const val = item[field];
          if (typeof val === 'string') {
            return val.toLowerCase().includes(query);
          }
          return false;
        });
      });
    }

    // 2. Filters
    filters.forEach((filter) => {
      if (filter.value !== 'all' && filter.value !== '') {
        result = result.filter((item) => String(item[filter.field]) === filter.value);
      }
    });

    // 3. Sort
    if (sortBy && sortConfig && sortConfig[sortBy]) {
      result.sort(sortConfig[sortBy]);
    }

    return result;
  }, [data, searchQuery, searchFields, filters, sortBy, sortConfig]);
}
