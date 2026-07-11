import React from 'react';
import { Search } from 'lucide-react';

interface GoalSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const GoalSearch: React.FC<GoalSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative flex-1 md:max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/70" />
      <label htmlFor="goal-search" className="sr-only">Search Goals</label>
      <input
        id="goal-search"
        name="goal-search"
        type="text"
        placeholder="Search goals..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-surfaceHighlight border border-border/20 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-primary placeholder:text-secondary/50"
      />
    </div>
  );
};
