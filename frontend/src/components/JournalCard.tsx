import React from 'react';
import {  } from 'framer-motion';
import { Calendar, ChevronRight, Heart } from 'lucide-react';
import type { JournalEntry } from '../types';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';

interface JournalCardProps {
  entry: JournalEntry;
  isActive: boolean;
  onClick: (entry: JournalEntry) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({ entry, isActive, onClick, onToggleFavorite }) => {
  // Legacy fallback for date parsing if needed
  const displayDate = entry.date || new Date().toISOString();
  let formattedDate = entry.date;
  try {
    formattedDate = format(parseISO(displayDate), 'MMM do, yyyy');
  } catch (e) {
    // If it's already a string like "July 6, 2026"
  }

  return (
    <div 
      onClick={() => onClick(entry)}
      className={cn(
        "p-4 rounded-2xl transition-colors cursor-pointer group border relative",
        isActive 
          ? "bg-surfaceHighlight border-border/20" 
          : "bg-transparent hover:bg-surfaceHighlight border-transparent hover:border-border/20"
      )}
    >
      <div className="flex justify-between items-start mb-1 gap-2">
        <h4 className="font-medium text-sm text-primary group-hover:text-accent transition-colors line-clamp-1 flex-1">
          {entry.title || 'Untitled Entry'}
        </h4>
        <button 
          onClick={(e) => onToggleFavorite(entry.id, e)}
          className={cn(
            "p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none",
            entry.favorite ? "opacity-100 text-red-500" : "text-secondary hover:text-red-400"
          )}
        >
          <Heart className="w-4 h-4" fill={entry.favorite ? "currentColor" : "none"} />
        </button>
      </div>
      
      <p className="text-xs text-secondary mb-2 flex items-center gap-1.5">
        <Calendar className="w-3 h-3" />
        {formattedDate}
        {entry.mood && (
          <>
            <span className="mx-1">•</span>
            <span>{entry.mood}</span>
          </>
        )}
      </p>
      
      <p className="text-xs text-secondary/70 line-clamp-2 leading-relaxed sensitive-data">
        {entry.excerpt || entry.content || 'No content...'}
      </p>

      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {entry.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-surfaceHighlight rounded text-secondary">
              #{tag}
            </span>
          ))}
          {entry.tags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 text-secondary">+{entry.tags.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};
