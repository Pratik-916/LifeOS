import React from 'react';
import { Search, Plus } from 'lucide-react';

interface TaskToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddTask: () => void;
}

export const TaskToolbar: React.FC<TaskToolbarProps> = ({ searchQuery, setSearchQuery, onAddTask }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/70" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-surfaceHighlight border border-border/20 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-accent transition-colors text-sm"
        />
      </div>
      <button 
        onClick={onAddTask}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors whitespace-nowrap text-sm"
      >
        <Plus className="w-4 h-4" /> Add Task
      </button>
    </div>
  );
};
