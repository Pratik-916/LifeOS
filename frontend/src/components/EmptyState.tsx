import React from 'react';
import { ClipboardList } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/50 rounded-2xl bg-surfaceHighlight">
      <div className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
      <p className="text-secondary text-sm max-w-sm">
        You don't have any tasks matching these filters, or you've completed them all!
      </p>
    </div>
  );
};
