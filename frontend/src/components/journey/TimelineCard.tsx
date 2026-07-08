import React from 'react';
import type { TimelineEvent } from '../../types';
import { motion } from 'framer-motion';
import { Target, Trophy, BookOpen, Flame, CheckCircle2, Image as ImageIcon, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format, parseISO } from 'date-fns';

interface TimelineCardProps {
  event: TimelineEvent;
  index: number;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'goal': return Target;
    case 'milestone': return Trophy;
    case 'journal': return BookOpen;
    case 'habit': return Flame;
    case 'task': return CheckCircle2;
    case 'memory': return ImageIcon;
    default: return Trophy;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'goal': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'milestone': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'journal': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
    case 'habit': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'task': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    case 'memory': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    default: return 'text-secondary bg-surfaceHighlight border-border/20';
  }
};

export const TimelineCard: React.FC<TimelineCardProps> = ({ event, index }) => {
  const Icon = getEventIcon(event.type);
  const colorClass = getEventColor(event.type);
  
  let formattedDate = event.date;
  try {
    formattedDate = format(parseISO(event.date), 'MMM do');
  } catch (e) {}

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative pl-6 md:pl-8 py-4 group"
    >
      {/* Node Dot */}
      <div className={cn(
        "absolute left-[7px] md:left-[11px] top-6 -translate-x-1/2 w-3 h-3 rounded-full border-2 bg-surface z-10 transition-transform group-hover:scale-125",
        colorClass.split(' ')[0].replace('text-', 'border-')
      )} />

      <div className="bg-surfaceHighlight backdrop-blur-md border border-border/20 rounded-2xl p-5 hover:bg-surfaceHighlight hover:border-border/20 transition-all shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg border", colorClass)}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-primary flex items-center gap-2">
                {event.title}
                {event.favorite && <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />}
              </h4>
              <span className="text-xs font-medium text-secondary/70">{formattedDate}</span>
            </div>
          </div>
        </div>
        
        {event.description && (
          <p className="text-sm text-secondary/90 mt-3 leading-relaxed">
            {event.type === 'journal' ? `"${event.description}"` : event.description}
          </p>
        )}

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {event.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-surfaceHighlight text-secondary text-[10px] font-medium tracking-wide uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
