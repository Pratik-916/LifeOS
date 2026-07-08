import React from 'react';
import { Plus } from 'lucide-react';

interface GoalToolbarProps {
  onNewGoal: () => void;
}

export const GoalToolbar: React.FC<GoalToolbarProps> = ({ onNewGoal }) => {
  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={onNewGoal}
        className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
      >
        <Plus className="w-4 h-4" /> New Goal
      </button>
    </div>
  );
};
