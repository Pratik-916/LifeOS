import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardWidget } from './DashboardWidget';
import { useJourneyTimeline } from '../../journey/hooks';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const JourneyCard = () => {
  const { data: timelineData, isLoading, isError, error, refetch } = useJourneyTimeline({});
  const navigate = useNavigate();

  // Flatten timeline to get latest events
  const latestEvents = timelineData?.results?.flatMap(year => 
    year.months.flatMap(month => month.events)
  ).slice(0, 3) || [];

  return (
    <DashboardWidget
      id="journey"
      title="Journey Highlights"
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      isEmpty={latestEvents.length === 0}
      onRefresh={refetch}
      headerAction={
        <button 
          onClick={() => navigate('/journey')}
          className="text-xs text-accent hover:underline flex items-center gap-1"
        >
          View Journey <ArrowRight className="w-3 h-3" />
        </button>
      }
      emptyState={
        <div className="text-center text-secondary py-4">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No memories recorded.</p>
        </div>
      }
    >
      <div className="space-y-4">
        {latestEvents.map(event => (
          <div key={event.id} onClick={() => navigate('/journey')} className="group cursor-pointer flex gap-3 items-center">
            {event.image ? (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-12 h-12 rounded-lg object-cover bg-surfaceHighlight shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-surfaceHighlight flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5 text-secondary/50" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-primary text-sm truncate group-hover:text-accent transition-colors">
                {event.title}
              </h4>
              <p className="text-xs text-secondary">
                {format(parseISO(event.timestamp), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
};
