import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

interface TaskFiltersProps {
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  priorityFilter: string;
  setPriorityFilter: (p: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter, setStatusFilter,
  priorityFilter, setPriorityFilter,
  categoryFilter, setCategoryFilter,
  sortBy, setSortBy
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6 p-4 bg-surfaceHighlight rounded-xl border border-border/20">
      <div className="flex items-center gap-2 mr-2">
        <Filter className="w-4 h-4 text-secondary" />
        <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Filters</span>
      </div>
      
      <select 
        value={statusFilter} 
        onChange={(e) => setStatusFilter(e.target.value)}
        className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent transition-colors appearance-none"
      >
        <option value="all">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      
      <select 
        value={priorityFilter} 
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent transition-colors appearance-none"
      >
        <option value="all">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select 
        value={categoryFilter} 
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent transition-colors appearance-none"
      >
        <option value="all">All Categories</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Health">Health</option>
        <option value="Learning">Learning</option>
      </select>

      <div className="h-6 w-px bg-surfaceHighlight mx-1 self-center" />

      <div className="flex items-center gap-2 mr-2">
        <ArrowUpDown className="w-4 h-4 text-secondary" />
        <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Sort</span>
      </div>

      <select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-surfaceHighlight border border-border/20 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent transition-colors appearance-none"
      >
        <option value="dueDateAsc">Due Date (Earliest)</option>
        <option value="dueDateDesc">Due Date (Latest)</option>
        <option value="priorityDesc">Priority (High to Low)</option>
        <option value="priorityAsc">Priority (Low to High)</option>
      </select>
    </div>
  );
};
