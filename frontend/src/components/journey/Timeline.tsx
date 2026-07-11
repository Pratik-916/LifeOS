import React, { useState, useEffect } from 'react';
import type { TimelineYearModel, TimelineEventModel } from '../../features/journey/api/journey.types';
import { TimelineYear } from './TimelineYear';
import { EmptyState } from '../ui/EmptyState';
import { Map } from 'lucide-react';

interface TimelineProps {
  timeline: TimelineYearModel[];
  onEditMemory?: (event: TimelineEventModel) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ timeline, onEditMemory }) => {
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  useEffect(() => {
    if (timeline.length > 0 && !expandedYear) {
      setExpandedYear(timeline[0].year);
    }
  }, [timeline]);

  const toggleYear = (year: string) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  if (timeline.length === 0) {
    return (
      <EmptyState
        icon={Map}
        title="No Journey Events"
        message="Start tracking goals, tasks, habits, and journals to automatically build your timeline, or manually add a Memory!"
      />
    );
  }

  return (
    <div className="relative pl-4">
      {timeline.map((yearData) => (
        <TimelineYear
          key={yearData.year}
          data={yearData}
          isExpanded={expandedYear === yearData.year}
          onToggle={() => toggleYear(yearData.year)}
          onEditMemory={onEditMemory}
        />
      ))}
    </div>
  );
};
