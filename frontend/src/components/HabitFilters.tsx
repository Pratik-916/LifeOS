import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

interface HabitFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  frequencyFilter: string;
  setFrequencyFilter: (f: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
}

const CATEGORIES = ['Health', 'Learning', 'Work', 'Personal', 'Finance', 'Other'];
const FREQUENCIES = ['daily', 'weekly'];

export const HabitFilters: React.FC<HabitFiltersProps> = ({
  categoryFilter, setCategoryFilter,
  frequencyFilter, setFrequencyFilter,
  sortBy, setSortBy
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
      <div className="flex items-center gap-2 mr-2">
        <Filter className="w-4 h-4 text-secondary" />
        <span className="text-sm font-medium text-secondary hidden sm:inline-block">Filter</span>
      </div>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
      >
        <option value="all">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        value={frequencyFilter}
        onChange={(e) => setFrequencyFilter(e.target.value)}
        className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
      >
        <option value="all">All Frequencies</option>
        {FREQUENCIES.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
      </select>

      <div className="w-px h-6 bg-surfaceHighlight mx-1 hidden md:block" />

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-secondary" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-0 appearance-none cursor-pointer text-primary"
        >
          <option value="nameAsc">A-Z</option>
          <option value="streakDesc">Highest Streak</option>
          <option value="completionDesc">Highest Completion</option>
        </select>
      </div>
    </div>
  );
};
