import React from 'react';
import { BookOpen } from 'lucide-react';

export const JournalEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/50 rounded-2xl bg-surfaceHighlight mt-4">
      <div className="w-12 h-12 rounded-full bg-surfaceHighlight flex items-center justify-center mb-3">
        <BookOpen className="w-6 h-6 text-secondary" />
      </div>
      <h3 className="text-sm font-semibold mb-1">No entries found</h3>
      <p className="text-secondary text-xs max-w-[200px]">
        Try adjusting your filters or create a new journal entry!
      </p>
    </div>
  );
};
