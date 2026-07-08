import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface JournalToolbarProps {
  onNewEntry: () => void;
  onDeleteActive?: () => void;
  hasActiveEntry: boolean;
}

export const JournalToolbar: React.FC<JournalToolbarProps> = ({ onNewEntry, onDeleteActive, hasActiveEntry }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button 
        onClick={onNewEntry}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors text-sm shadow-lg shadow-accent/20"
      >
        <Plus className="w-4 h-4" /> New Entry
      </button>
      
      {hasActiveEntry && onDeleteActive && (
        <button 
          onClick={onDeleteActive}
          className="flex-shrink-0 flex items-center justify-center p-2.5 bg-surfaceHighlight text-danger hover:bg-danger/20 border border-border/20 rounded-xl transition-colors"
          title="Delete Entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
