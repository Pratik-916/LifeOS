import React from 'react';
import { Target } from 'lucide-react';

export const GoalEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border/50 rounded-2xl bg-surfaceHighlight">
      <div className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center mb-4">
        <Target className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-bold mb-2">No goals found</h3>
      <p className="text-secondary text-sm max-w-[280px]">
        You haven't set any goals that match your filters, or you haven't created one yet.
      </p>
    </div>
  );
};
