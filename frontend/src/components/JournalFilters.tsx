import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

interface JournalFiltersProps {
  moodFilter: string;
  setMoodFilter: (mood: string) => void;
  favoriteFilter: boolean;
  setFavoriteFilter: (fav: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const MOODS = ['Happy', 'Neutral', 'Sad', 'Excited', 'Tired', 'Motivated', 'Inspired'];

export const JournalFilters: React.FC<JournalFiltersProps> = ({
  moodFilter, setMoodFilter,
  favoriteFilter, setFavoriteFilter,
  sortBy, setSortBy
}) => {
  return (
    <div className="flex flex-col gap-3 mb-6 p-4 bg-surface rounded-xl border border-border/20 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-secondary" />
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Filters</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <select 
          value={moodFilter} 
          onChange={(e) => setMoodFilter(e.target.value)}
          className="flex-1 bg-surfaceHighlight border border-border/20 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-accent transition-colors appearance-none min-w-[100px]"
        >
          <option value="all">All Moods</option>
          {MOODS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select 
          value={favoriteFilter ? 'favorites' : 'all'} 
          onChange={(e) => setFavoriteFilter(e.target.value === 'favorites')}
          className="flex-1 bg-surfaceHighlight border border-border/20 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-accent transition-colors appearance-none min-w-[100px]"
        >
          <option value="all">All Entries</option>
          <option value="favorites">Favorites Only</option>
        </select>
      </div>

      <div className="w-full h-px bg-border my-1" />

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-secondary" />
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1 bg-transparent border-none text-xs focus:outline-none focus:ring-0 appearance-none font-medium cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};
