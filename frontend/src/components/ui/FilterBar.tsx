import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  filters: FilterConfig[];
  sortBy?: string;
  setSortBy?: (s: string) => void;
  sortOptions?: FilterOption[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  sortBy,
  setSortBy,
  sortOptions
}) => {
  if (filters.length === 0 && !sortOptions) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
      {filters.length > 0 && (
        <div className="flex items-center gap-2 mr-2">
          <Filter className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-secondary hidden sm:inline-block">Filter</span>
        </div>
      )}

      {filters.map(filter => (
        <select
          key={filter.id}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
        >
          {filter.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}

      {sortOptions && sortOptions.length > 0 && setSortBy && (
        <>
          {filters.length > 0 && <div className="w-px h-6 bg-surfaceHighlight mx-1 hidden md:block" />}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-secondary" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-0 appearance-none cursor-pointer text-primary"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};
