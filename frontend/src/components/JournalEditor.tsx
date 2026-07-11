import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, AlignLeft, CheckSquare, Hash, Save, Check, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import type { JournalEntryModel } from '../features/journal/api/journal.types';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { useAppStore } from '../store/useAppStore';
import { useUpdateJournalEntry, useCreateJournalEntry } from '../features/journal/hooks';
import { useOfflineStatus } from '../hooks/useOfflineStatus';

interface JournalEditorProps {
  entry: JournalEntryModel;
  onDraftCreated?: (id: string) => void;
}

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'neutral', label: 'Neutral', emoji: '😐' },
  { id: 'sad', label: 'Sad', emoji: '😔' },
  { id: 'excited', label: 'Excited', emoji: '🤩' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'motivated', label: 'Motivated', emoji: '🚀' },
  { id: 'inspired', label: 'Inspired', emoji: '✨' },
];

export const JournalEditor: React.FC<JournalEditorProps> = ({ entry, onDraftCreated }) => {
  const [localEntry, setLocalEntry] = useState<JournalEntryModel>(entry);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'unsaved' | 'offline' | 'error' | 'conflict'>('idle');
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState<string>(entry.tags?.join(', ') || '');
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueueRef = useRef<Promise<any>>(Promise.resolve());
  const isCreatingDraft = useRef(false);
  
  const isOffline = useOfflineStatus();
  const { mutateAsync: updateEntryAsync } = useUpdateJournalEntry();
  const { mutateAsync: createEntryAsync } = useCreateJournalEntry();

  // Load from local storage if available for this entry
  useEffect(() => {
    // Prevent overwriting local edits if we just transitioned from draft to the newly saved ID
    if (localEntry.id === entry.id && entry.id !== 'draft') return;

    if (entry.id !== 'draft') {
      const pendingData = localStorage.getItem(`journal_draft_${entry.id}`);
      if (pendingData) {
        try {
          const parsed = JSON.parse(pendingData);
          setLocalEntry(parsed);
          setSaveStatus('unsaved');
        } catch (e) {
          setLocalEntry(entry);
          setSaveStatus('idle');
        }
      } else {
        setLocalEntry(entry);
        setSaveStatus('idle');
      }
    } else {
      setLocalEntry(entry);
      setSaveStatus('idle');
    }
    setTagsInput(entry.tags?.join(', ') || '');
    setConflictMessage(null);
    isCreatingDraft.current = false;
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.id]); // Intentionally not dependent on entry object fully to avoid overwriting pending edits on background refresh

  // Monitor offline status
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isOffline && saveStatus !== 'idle' && saveStatus !== 'saved') {
      setSaveStatus('offline');
    } else if (!isOffline && saveStatus === 'offline') {
      setSaveStatus('unsaved');
      // trigger save
      handleDebouncedSave(localEntry);
    }
  }, [isOffline]);

  const persistToLocalStorage = (data: JournalEntryModel) => {
    if (data.id !== 'draft') {
      localStorage.setItem(`journal_draft_${data.id}`, JSON.stringify(data));
    }
  };

  const clearLocalStorage = (id: string) => {
    localStorage.removeItem(`journal_draft_${id}`);
  };

  const handleDebouncedSave = useCallback((latestData: JournalEntryModel) => {
    if (isOffline) {
      setSaveStatus('offline');
      return;
    }
    if (conflictMessage) return; // Stop saving if in conflict

    setSaveStatus('saving');

    saveQueueRef.current = saveQueueRef.current.then(async () => {
      try {
        if (latestData.id === 'draft') {
          if (isCreatingDraft.current) return;
          
          // Only create draft if there's actual content
          if (!latestData.title && !latestData.content && !latestData.todaysWins && !latestData.challenges && !latestData.gratitude && !latestData.lessonsLearned && !latestData.tomorrowFocus) {
            setSaveStatus('idle');
            return;
          }
          
          isCreatingDraft.current = true;
          const newEntry = await createEntryAsync({
            title: latestData.title || 'Untitled Draft',
            content: latestData.content,
            mood: latestData.mood,
            gratitude: latestData.gratitude,
            todays_wins: latestData.todaysWins,
            challenges: latestData.challenges,
            lessons_learned: latestData.lessonsLearned,
            tomorrow_focus: latestData.tomorrowFocus,
            tags: latestData.tags,
            status: 'draft'
          });
          
          isCreatingDraft.current = false;
          setSaveStatus('saved');
          setLocalEntry(prev => ({ ...prev, id: newEntry.id }));
          if (onDraftCreated) onDraftCreated(newEntry.id);
          
        } else {
            // Update existing
            await updateEntryAsync({
              id: latestData.id,
              payload: {
                title: latestData.title,
                content: latestData.content,
                mood: latestData.mood,
                gratitude: latestData.gratitude,
                todays_wins: latestData.todaysWins,
                challenges: latestData.challenges,
                lessons_learned: latestData.lessonsLearned,
                tomorrow_focus: latestData.tomorrowFocus,
                last_updated_at: latestData.lastUpdatedAt,
                tags: latestData.tags,
              }
            });
            
            clearLocalStorage(latestData.id);
          setSaveStatus('saved');
          setTimeout(() => {
            setSaveStatus(prev => prev === 'saved' ? 'idle' : prev);
          }, 2000);
        }
      } catch (error: any) {
        if (error?.response?.status === 400 && error?.response?.data?.non_field_errors) {
          setConflictMessage(error.response.data.non_field_errors[0] || 'Conflict detected');
          setSaveStatus('conflict');
        } else {
          setSaveStatus('error');
        }
      }
    });
  }, [isOffline, conflictMessage, createEntryAsync, updateEntryAsync, onDraftCreated]);

  const handleChange = (field: keyof JournalEntryModel, value: any) => {
    const updated = { ...localEntry, [field]: value };
    setLocalEntry(updated);
    
    if (updated.id !== 'draft') {
      persistToLocalStorage(updated);
    }
    
    setSaveStatus('unsaved');

    if (timerRef.current) clearTimeout(timerRef.current);
    
    const settings = useAppStore.getState().settings;
    if (settings.autosave) {
      timerRef.current = setTimeout(() => {
        handleDebouncedSave(updated);
      }, 1000); // 1s debounce
    }
  };

  const handleReload = () => {
    clearLocalStorage(entry.id);
    setLocalEntry(entry);
    setTagsInput(entry.tags?.join(', ') || '');
    setConflictMessage(null);
    setSaveStatus('idle');
  };

  const displayDate = entry.createdAt || new Date().toISOString();
  let formattedDate = entry.createdAt;
  try {
    formattedDate = format(parseISO(displayDate), 'MMMM do, yyyy');
  } catch (e) {
    // fallback
  }

  return (
    <div className="flex-1 bg-surfaceHighlight rounded-3xl border border-border/20 p-8 lg:p-12 relative overflow-y-auto no-scrollbar flex flex-col">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-2xl mx-auto space-y-10 relative z-10 w-full flex-1">
        
        {conflictMessage && (
          <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Version Conflict</h4>
              <p className="text-sm mt-1">{conflictMessage}</p>
            </div>
            <button 
              onClick={handleReload}
              className="px-3 py-1.5 bg-danger text-white text-xs font-medium rounded-lg hover:bg-danger/90 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" /> Reload
            </button>
          </div>
        )}

        {/* Header & Save Indicator */}
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <input 
              type="text" 
              placeholder="Untitled Entry"
              value={localEntry.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              disabled={!!conflictMessage}
              className="w-full bg-transparent text-4xl md:text-5xl font-bold tracking-tight text-primary placeholder:text-secondary/50 focus:outline-none disabled:opacity-50"
            />
            
            {/* Save Status Indicator */}
            <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-surface text-secondary border border-border/10">
              {saveStatus === 'offline' && <><WifiOff className="w-3 h-3 text-warning" /> Offline</>}
              {saveStatus === 'saving' && <><Save className="w-3 h-3 animate-pulse text-accent" /> Saving...</>}
              {saveStatus === 'saved' && <><Check className="w-3 h-3 text-success" /> Saved</>}
              {saveStatus === 'idle' && <span className="opacity-60">Idle</span>}
              {saveStatus === 'unsaved' && <span className="text-warning">Unsaved Changes</span>}
              {saveStatus === 'error' && <span className="text-danger">Sync Error</span>}
              {saveStatus === 'conflict' && <span className="text-danger font-bold">Conflict</span>}
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
              <span>{entry.wordCount || 0} words</span>
            </div>
            <span>•</span>
            <span>{entry.readingTime || 1} min read</span>
            
            {entry.aiProcessed && (
              <>
                <span>•</span>
                <span className="text-accent">AI Processed</span>
              </>
            )}
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
                disabled={!!conflictMessage}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm disabled:opacity-50",
                  localEntry.mood === mood.id 
                    ? "bg-accent/20 border-accent/40 text-accent" 
                    : "bg-transparent border-border/20 text-secondary hover:bg-surfaceHighlight hover:text-primary"
                )}
              >
                <span className="text-base">{mood.emoji}</span>
                <span className="font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags UI */}
        <div className="space-y-3 pt-4 border-t border-border/10">
          <label className="text-sm font-medium text-secondary flex items-center gap-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. work, thoughts, health"
            value={tagsInput}
            onChange={(e) => {
              setTagsInput(e.target.value);
              const newTags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
              handleChange('tags', newTags);
            }}
            disabled={!!conflictMessage}
            className="w-full bg-surfaceHighlight border border-border/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
          />
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
              disabled={!!conflictMessage}
              className="w-full h-24 bg-transparent resize-none focus:outline-none text-primary placeholder:text-success/40 text-sm leading-relaxed disabled:opacity-50"
              placeholder="What went well today? Big or small..."
            />
          </div>

          <div className="space-y-3 p-5 rounded-2xl dark:bg-orange-500/10 bg-orange-500/5 border dark:border-orange-500/20 border-orange-500/10 transition-colors focus-within:border-orange-500/30">
            <h3 className="font-semibold text-orange-500 flex items-center gap-2">
              <Hash className="w-4 h-4" /> What I Learned
            </h3>
            <textarea 
              value={localEntry.lessonsLearned || ''}
              onChange={(e) => handleChange('lessonsLearned', e.target.value)}
              disabled={!!conflictMessage}
              className="w-full h-24 bg-transparent resize-none focus:outline-none text-primary placeholder:text-orange-500/40 text-sm leading-relaxed disabled:opacity-50"
              placeholder="Insights, lessons, or new knowledge..."
            />
          </div>

          <div className="space-y-3 p-5 rounded-2xl dark:bg-danger/10 bg-danger/5 border dark:border-danger/20 border-danger/10 transition-colors focus-within:border-danger/30">
            <h3 className="font-semibold text-danger flex items-center gap-2">
              <Hash className="w-4 h-4" /> Challenges
            </h3>
            <textarea 
              value={localEntry.challenges || ''}
              onChange={(e) => handleChange('challenges', e.target.value)}
              disabled={!!conflictMessage}
              className="w-full h-24 bg-transparent resize-none focus:outline-none text-primary placeholder:text-danger/40 text-sm leading-relaxed disabled:opacity-50"
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
              disabled={!!conflictMessage}
              className="w-full h-24 bg-transparent resize-none focus:outline-none text-primary placeholder:text-purple-500/40 text-sm leading-relaxed disabled:opacity-50"
              placeholder="I am grateful for..."
            />
          </div>
          
          <div className="space-y-3 p-5 rounded-2xl dark:bg-blue-500/10 bg-blue-500/5 border dark:border-blue-500/20 border-blue-500/10 transition-colors focus-within:border-blue-500/30 md:col-span-2">
            <h3 className="font-semibold text-blue-500 flex items-center gap-2">
              <Hash className="w-4 h-4" /> Tomorrow's Focus
            </h3>
            <textarea 
              value={localEntry.tomorrowFocus || ''}
              onChange={(e) => handleChange('tomorrowFocus', e.target.value)}
              disabled={!!conflictMessage}
              className="w-full h-20 bg-transparent resize-none focus:outline-none text-primary placeholder:text-blue-500/40 text-sm leading-relaxed disabled:opacity-50"
              placeholder="What is your main focus for tomorrow?"
            />
          </div>
        </div>

        {/* Main Freeform Editor */}
        <div className="pt-6 border-t border-border/20 space-y-4 flex-1 flex flex-col">
          <textarea
            value={localEntry.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            disabled={!!conflictMessage}
            className="w-full flex-1 min-h-[400px] bg-transparent resize-none focus:outline-none text-primary/90 placeholder:text-secondary/30 text-lg leading-relaxed font-serif disabled:opacity-50"
            placeholder="Write your thoughts here... Start typing to focus."
          />
        </div>
        
        {/* AI Metadata Display (Read-Only) */}
        {entry.aiSummary && (
          <div className="pt-6 border-t border-border/20 space-y-4">
             <h3 className="text-sm font-medium text-secondary">AI Summary</h3>
             <p className="text-sm text-secondary/80 bg-surfaceHighlight p-4 rounded-xl leading-relaxed italic border border-border/10">
               {entry.aiSummary}
             </p>
          </div>
        )}

      </div>
    </div>
  );
};

