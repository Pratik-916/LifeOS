import React, { useState } from 'react';
import type { TimelineMonth as ITimelineMonth } from '../../hooks/useJourneyData';
import { TimelineCard } from './TimelineCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TimelineMonthProps {
  data: ITimelineMonth;
  isExpanded: boolean;
  onToggle: () => void;
}

export const TimelineMonth: React.FC<TimelineMonthProps> = ({ data, isExpanded, onToggle }) => {
  return (
    <div className="relative pl-6 md:pl-8 mb-6">
      {/* Month Node Line */}
      <div className="absolute left-[7px] md:left-[11px] top-4 bottom-0 w-0.5 bg-surfaceHighlight -translate-x-1/2" />
      
      <div 
        onClick={onToggle}
        className="flex items-center gap-3 cursor-pointer group py-2"
      >
        <div className="absolute left-[7px] md:left-[11px] top-5 -translate-x-1/2 w-2 h-2 rounded-full bg-secondary/50 group-hover:bg-accent transition-colors z-10" />
        
        <h4 className="text-sm font-bold text-secondary uppercase tracking-widest group-hover:text-primary transition-colors">
          {data.month}
        </h4>
        <div className="h-px flex-1 bg-surfaceHighlight group-hover:bg-surfaceHighlight transition-colors" />
        <span className="text-xs text-secondary/50 font-medium px-2 py-0.5 rounded-full bg-surfaceHighlight group-hover:bg-surfaceHighlight transition-colors">
          {data.events.length} events
        </span>
        <motion.div 
          animate={{ rotate: isExpanded ? 180 : 0 }} 
          className="w-5 h-5 flex items-center justify-center text-secondary group-hover:text-primary transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-4 space-y-2">
              {data.events.map((event, idx) => (
                <TimelineCard key={event.id} event={event} index={idx} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
