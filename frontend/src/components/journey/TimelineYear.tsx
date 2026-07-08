import React, { useState } from 'react';
import type { TimelineYear as ITimelineYear } from '../../hooks/useJourneyData';
import { TimelineMonth } from './TimelineMonth';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface TimelineYearProps {
  data: ITimelineYear;
  isExpanded: boolean;
  onToggle: () => void;
}

export const TimelineYear: React.FC<TimelineYearProps> = ({ data, isExpanded, onToggle }) => {
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  const toggleMonth = (month: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  const totalEvents = data.months.reduce((acc, m) => acc + m.events.length, 0);

  return (
    <div className="relative mb-12">
      {/* Year Node Header */}
      <div 
        onClick={onToggle}
        className="group flex items-center gap-4 cursor-pointer mb-6"
      >
        <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl bg-surfaceHighlight border border-border/20 group-hover:bg-surfaceHighlight group-hover:border-border/20 transition-all shadow-xl">
          <motion.div 
            animate={{ rotate: isExpanded ? 180 : 0 }} 
            className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white shadow-lg"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
          <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">
            {data.year}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
            {data.year} Overview
          </h3>
          <p className="text-sm text-secondary font-medium">
            {totalEvents} events recorded
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden ml-7 md:ml-7"
          >
            <div className="border-l-2 border-border/20 pt-2 pb-6">
              {data.months.map(month => (
                <TimelineMonth 
                  key={month.month}
                  data={month}
                  isExpanded={expandedMonths[month.month] || false}
                  onToggle={() => toggleMonth(month.month)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
