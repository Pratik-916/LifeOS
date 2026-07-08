import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

interface GoalFiltersProps {
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  priorityFilter: string;
  setPriorityFilter: (p: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
}

const STATUSES = ['Not Started', 'In Progress', 'Completed', 'Archived'];
const CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Finance', 'Project'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export const GoalFilters: React.FC<GoalFiltersProps> = ({
  statusFilter, setStatusFilter,
  categoryFilter, setCategoryFilter,
  priorityFilter, setPriorityFilter,
  sortBy, setSortBy
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
      <div className="flex items-center gap-2 mr-2">
        <Filter className="w-4 h-4 text-secondary" />
        <span className="text-sm font-medium text-secondary hidden sm:inline-block">Filter</span>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
      >
        <option value="all">All Statuses</option>
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
      >
        <option value="all">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors appearance-none"
      >
        <option value="all">All Priorities</option>
        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      <div className="w-px h-6 bg-surfaceHighlight mx-1 hidden md:block" />

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-secondary" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent border-none text-sm font-medium focus:outline-none focus:ring-0 appearance-none cursor-pointer text-primary"
        >
          <option value="targetDateAsc">Deadline (Soonest)</option>
          <option value="targetDateDesc">Deadline (Furthest)</option>
          <option value="progressDesc">Progress (High-Low)</option>
          <option value="progressAsc">Progress (Low-High)</option>
        </select>
      </div>
    </div>
  );
};
