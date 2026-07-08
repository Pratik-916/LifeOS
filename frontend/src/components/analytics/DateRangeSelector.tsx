import React from 'react';
import type { TimeRange } from '../../hooks/useAnalyticsStats';
import { Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DateRangeSelectorProps {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const RANGES: { label: string; value: TimeRange }[] = [
  { label: '7 Days', value: '7D' },
  { label: '30 Days', value: '30D' },
  { label: '90 Days', value: '90D' },
  { label: 'This Year', value: 'YEAR' },
  { label: 'All Time', value: 'ALL' },
];

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ timeRange, setTimeRange }) => {
  return (
    <div className="flex items-center gap-2 bg-surfaceHighlight p-1.5 rounded-xl border border-border/20">
      <div className="pl-2 pr-1 hidden sm:block">
        <Calendar className="w-4 h-4 text-secondary" />
      </div>
      <div className="flex">
        {RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-lg transition-all",
              timeRange === range.value 
                ? "bg-accent text-white shadow-sm" 
                : "text-secondary hover:text-primary hover:bg-surfaceHighlight"
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};
