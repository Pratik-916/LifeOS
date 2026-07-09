import React from 'react';
import { Calendar, Heart, Pin } from 'lucide-react';
import type { JournalEntryModel } from '../features/journal/api/journal.types';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';

interface JournalCardProps {
  entry: JournalEntryModel;
  isActive: boolean;
  onClick: (entry: JournalEntryModel) => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({ entry, isActive, onClick, onToggleFavorite }) => {
  const displayDate = entry.createdAt || new Date().toISOString();
  let formattedDate = entry.createdAt;
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
        <h4 className="font-medium text-sm text-primary group-hover:text-accent transition-colors line-clamp-1 flex-1 flex items-center gap-2">
          {entry.isPinned && <Pin className="w-3 h-3 text-accent" />}
          {entry.title || 'Untitled Entry'}
        </h4>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
          className={cn(
            "p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10 relative",
            entry.isFavorite ? "opacity-100 text-red-500" : "text-secondary hover:text-red-400"
          )}
        >
          <Heart className="w-4 h-4" fill={entry.isFavorite ? "currentColor" : "none"} />
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
        {entry.summary || entry.content || 'No content...'}
      </p>

      {entry.tagsDetail && entry.tagsDetail.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {entry.tagsDetail.slice(0, 3).map(tag => (
            <span key={tag.id} className="text-[10px] px-1.5 py-0.5 rounded text-secondary" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
              #{tag.name}
            </span>
          ))}
          {entry.tagsDetail.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 text-secondary bg-surfaceHighlight rounded">+{entry.tagsDetail.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};
