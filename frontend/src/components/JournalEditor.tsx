import React, { useState, useEffect, useRef } from 'react';
import {  } from 'framer-motion';
import { Calendar, AlignLeft, CheckSquare, Hash, Save, Check } from 'lucide-react';
import type { JournalEntry } from '../types';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { useAppStore } from '../store/useAppStore';

interface JournalEditorProps {
  entry: JournalEntry;
  onSave: (id: string, updates: Partial<JournalEntry>) => void;
}

const MOODS = [
  { id: 'Happy', emoji: '😊' },
  { id: 'Neutral', emoji: '😐' },
  { id: 'Sad', emoji: '😔' },
  { id: 'Excited', emoji: '🤩' },
  { id: 'Tired', emoji: '😴' },
  { id: 'Motivated', emoji: '🚀' },
  { id: 'Inspired', emoji: '✨' },
];

export const JournalEditor: React.FC<JournalEditorProps> = ({ entry, onSave }) => {
  // Local state for instant typing
  const [localEntry, setLocalEntry] = useState<JournalEntry>(entry);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when active entry changes externally
  useEffect(() => {
    setLocalEntry(entry);
    setSaveStatus('idle');
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [entry.id]);

  // Handle local changes and trigger debounced save
  const handleChange = (field: keyof JournalEntry, value: any) => {
    const updated = { ...localEntry, [field]: value };
    
    // Auto-calculate word/char counts if content changes
    if (field === 'content') {
      const text = value as string;
      const charCount = text.length;
      const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      
      updated.characterCount = charCount;
      updated.wordCount = wordCount;
      updated.readingTime = readingTime;
      
      // Update excerpt
      updated.excerpt = text.slice(0, 100) + (text.length > 100 ? '...' : '');
    }

    setLocalEntry(updated);
    setSaveStatus('saving');

    if (timerRef.current) clearTimeout(timerRef.current);
    
    const settings = useAppStore.getState().settings;
    if (settings.autosave) {
      timerRef.current = setTimeout(() => {
        onSave(localEntry.id, updated);
        setSaveStatus('saved');
        
        // Reset saved indicator after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 1000);
    }
  };

  const displayDate = localEntry.date || new Date().toISOString();
  let formattedDate = localEntry.date;
  try {
    formattedDate = format(parseISO(displayDate), 'MMMM do, yyyy');
  } catch (e) {
    // fallback
  }

  return (
    <div className="flex-1 bg-surfaceHighlight rounded-3xl border border-border/20 p-8 lg:p-12 relative overflow-y-auto no-scrollbar">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-2xl mx-auto space-y-10 relative z-10">
        
        {/* Header & Save Indicator */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <input 
              type="text" 
              placeholder="Untitled Entry"
              value={localEntry.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full bg-transparent text-4xl md:text-5xl font-bold tracking-tight text-primary placeholder:text-secondary/50 focus:outline-none"
            />
            
            {/* Save Status Indicator */}
            <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-surfaceHighlight text-secondary">
              {saveStatus === 'saving' && <><Save className="w-3 h-3 animate-pulse" /> Saving...</>}
              {saveStatus === 'saved' && <><Check className="w-3 h-3 text-success" /> Saved</>}
              {saveStatus === 'idle' && <span className="opacity-50">Saved locally</span>}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary border-b border-border/20 pb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5" title="Word Count">
              <AlignLeft className="w-4 h-4" />
              <span>{localEntry.wordCount || 0} words</span>
            </div>
            <span>•</span>
            <span>{localEntry.readingTime || 1} min read</span>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-secondary flex items-center gap-2">
            How are you feeling today?
          </label>
          <div className="flex flex-wrap gap-3">
            {MOODS.map(mood => (
              <button
                key={mood.id}
                onClick={() => handleChange('mood', mood.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm",
                  localEntry.mood === mood.id 
                    ? "bg-accent/20 border-accent/40 text-accent" 
                    : "bg-transparent border-border/20 text-secondary hover:bg-surfaceHighlight hover:text-primary"
                )}
              >
                <span className="text-base">{mood.emoji}</span>
                <span className="font-medium">{mood.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Structured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 p-5 rounded-2xl dark:bg-success/10 bg-success/5 border dark:border-success/20 border-success/10 transition-colors focus-within:border-success/30">
            <h3 className="font-semibold text-success flex items-center gap-2">
              <CheckSquare className="w-4 h-4" /> Today's Wins
            </h3>
            <textarea 
              value={localEntry.todaysWins || ''}
              onChange={(e) => handleChange('todaysWins', e.target.value)}
              className="w-full h-24 bg-transparent resize-none focus:outline-none text-primary placeholder:text-success/40 text-sm leading-relaxed"
              placeholder="What went well today? Big or small..."
            />
          </div>

          <div className="space-y-3 p-5 rounded-2xl dark:bg-orange-500/10 bg-orange-500/5 border dark:border-orange-500/20 border-orange-500/10 transition-colors focus-within:border-orange-500/30">
            <h3 className="font-semibold text-orange-500 flex items-center gap-2">
              <Hash className="w-4 h-4" /> What I Learned
            </h3>
            <textarea 
              value={localEntry.whatILearned || ''}
              onChange={(e) => handleChange('whatILearned', e.target.value)}
              className="w-full h-24 bg-transparent resize-none focus:outline-none text-primary placeholder:text-orange-500/40 text-sm leading-relaxed"
              placeholder="Insights, lessons, or new knowledge..."
            />
          </div>

          <div className="space-y-3 p-5 rounded-2xl dark:bg-danger/10 bg-danger/5 border dark:border-danger/20 border-danger/10 transition-colors focus-within:border-danger/30">
            <h3 className="font-semibold text-danger flex items-center gap-2">
              <Hash className="w-4 h-4" /> Challenges
            </h3>
            <textarea 
              value={localEntry.challengesFaced || ''}
              onChange={(e) => handleChange('challengesFaced', e.target.value)}
              className="w-full h-24 bg-transparent resize-none focus:outline-none text-primary placeholder:text-danger/40 text-sm leading-relaxed"
              placeholder="What obstacles did you face?"
            />
          </div>

          <div className="space-y-3 p-5 rounded-2xl dark:bg-purple-500/10 bg-purple-500/5 border dark:border-purple-500/20 border-purple-500/10 transition-colors focus-within:border-purple-500/30">
            <h3 className="font-semibold text-purple-500 flex items-center gap-2">
              <Hash className="w-4 h-4" /> Gratitude
            </h3>
            <textarea 
              value={localEntry.gratitude || ''}
              onChange={(e) => handleChange('gratitude', e.target.value)}
              className="w-full h-24 bg-transparent resize-none focus:outline-none text-primary placeholder:text-purple-500/40 text-sm leading-relaxed"
              placeholder="I am grateful for..."
            />
          </div>
        </div>

        {/* Main Freeform Editor */}
        <div className="pt-6 border-t border-border/20 space-y-4">
          <textarea
            value={localEntry.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="w-full min-h-[400px] bg-transparent resize-none focus:outline-none text-primary/90 placeholder:text-secondary/30 text-lg leading-relaxed font-serif"
            placeholder="Write your thoughts here... Start typing to focus."
          />
        </div>

      </div>
    </div>
  );
};
