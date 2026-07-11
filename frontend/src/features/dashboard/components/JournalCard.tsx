import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardWidget } from './DashboardWidget';
import { useJournalEntries } from '../../journal/hooks';
import { PenTool, ArrowRight, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const JournalCard = () => {
  const { data: journalResponse, isLoading, isError, error, refetch } = useJournalEntries({});
  const navigate = useNavigate();

  const latestEntry = journalResponse?.results?.[0];

  return (
    <DashboardWidget
      id="journal"
      title="Latest Journal"
      error={error as Error}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!latestEntry}
      onRefresh={refetch}
      headerAction={
        <button 
          onClick={() => navigate('/journal')}
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Journal <ArrowRight className="w-3 h-3" />
        </button>
      }
      emptyState={
        <div className="text-center text-secondary py-4">
          <PenTool className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No journal entries yet.</p>
        </div>
      }
    >
      {latestEntry && (
        <div 
          onClick={() => navigate('/journal')}
          className="h-full flex flex-col bg-surfaceHighlight/50 hover:bg-surfaceHighlight rounded-xl p-4 cursor-pointer transition-colors border border-border/5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-secondary font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {latestEntry.date ? format(parseISO(latestEntry.date), 'MMMM d, yyyy') : 'No Date'}
            </div>
            {latestEntry.mood && (
              <span className="text-lg" title={`Mood: ${latestEntry.mood}`}>
                {latestEntry.mood === 'Happy' ? '😊' : 
                 latestEntry.mood === 'Sad' ? '😔' : 
                 latestEntry.mood === 'Excited' ? '🤩' : 
                 latestEntry.mood === 'Tired' ? '😴' : 
                 latestEntry.mood === 'Motivated' ? '🚀' : 
                 latestEntry.mood === 'Inspired' ? '✨' : '😐'}
              </span>
            )}
          </div>
          
          <h4 className="font-bold text-primary mb-2 line-clamp-1">{latestEntry.title}</h4>
          
          <div className="flex-1 overflow-hidden relative">
            <p className="text-sm text-secondary line-clamp-3">
              {latestEntry.content.replace(/<[^>]*>?/gm, '')}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-surfaceHighlight/50 to-transparent"></div>
          </div>
        </div>
      )}
    </DashboardWidget>
  );
};
