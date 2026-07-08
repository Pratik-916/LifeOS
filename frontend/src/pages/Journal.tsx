import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {  motion, AnimatePresence  } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { JournalCard } from '../components/JournalCard';
import { JournalEditor } from '../components/JournalEditor';
import { format } from 'date-fns';
import type { JournalEntry } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { useFilterSort } from '../hooks/useFilterSort';
import { Button } from '../components/Button';
import { Plus, Trash2 } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Journal() {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, toggleJournalFavorite } = useAppStore();
  
  // Local UI State
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  
  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [favoriteFilter, setFavoriteFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Set initial active entry if none selected
  useEffect(() => {
    if (!activeEntryId && journalEntries.length > 0) {
      setActiveEntryId(journalEntries[0].id);
    }
  }, [journalEntries, activeEntryId]);

  const filteredEntries = useFilterSort({
    data: journalEntries,
    searchQuery,
    searchFields: ['title', 'content'],
    filters: [
      { field: 'mood', value: moodFilter },
      { field: 'favorite', value: favoriteFilter === 'true' ? 'true' : favoriteFilter === 'false' ? 'false' : 'all' },
    ],
    sortBy,
    sortConfig: {
      newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      oldest: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
  });

  const activeEntry = useMemo(() => {
    return journalEntries.find(e => e.id === activeEntryId);
  }, [journalEntries, activeEntryId]);

  const handleNewEntry = useCallback(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const settings = useAppStore.getState().settings;
    
    addJournalEntry({
      title: '',
      content: '',
      mood: settings.defaultMood || 'Neutral',
      tags: [],
      date: todayStr,
      favorite: false,
      wordCount: 0,
      readingTime: 1,
      characterCount: 0
    });
    
    setTimeout(() => {
      const state = useAppStore.getState();
      if (state.journalEntries.length > 0) {
        setActiveEntryId(state.journalEntries[0].id);
      }
    }, 0);
  }, [addJournalEntry]);

  const handleDeleteActive = useCallback(() => {
    if (activeEntryId) {
      if (window.confirm("Are you sure you want to delete this entry?")) {
        deleteJournalEntry(activeEntryId);
        setActiveEntryId(null);
      }
    }
  }, [activeEntryId, deleteJournalEntry]);

  return (
    <motion.div 
      className="flex flex-col lg:flex-row gap-8 pb-10 min-h-[calc(100vh-4rem)] max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* Left Sidebar: Entries List */}
      <motion.div variants={itemVariants} className="w-full lg:w-80 flex-shrink-0 flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Journal</h1>
            <p className="text-secondary text-sm">Document your journey.</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button onClick={handleNewEntry} className="flex-1" variant="primary">
            <Plus className="w-4 h-4 mr-2" /> New Entry
          </Button>
          {activeEntryId && (
            <Button onClick={handleDeleteActive} variant="secondary" className="px-3 text-secondary hover:text-danger">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="mb-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search entries..." />
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <FilterBar 
            filters={[
              {
                id: 'mood', label: 'Mood', value: moodFilter, onChange: setMoodFilter,
                options: [
                  { label: 'All Moods', value: 'all' },
                  { label: 'Happy', value: 'Happy' },
                  { label: 'Neutral', value: 'Neutral' },
                  { label: 'Sad', value: 'Sad' },
                  { label: 'Excited', value: 'Excited' },
                  { label: 'Tired', value: 'Tired' },
                  { label: 'Motivated', value: 'Motivated' }
                ]
              },
              {
                id: 'favorite', label: 'Favorite', value: favoriteFilter, onChange: setFavoriteFilter,
                options: [
                  { label: 'All Entries', value: 'all' },
                  { label: 'Favorites', value: 'true' }
                ]
              }
            ]}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={[
              { label: 'Newest First', value: 'newest' },
              { label: 'Oldest First', value: 'oldest' }
            ]}
          />
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-10">
          <AnimatePresence mode="popLayout">
            {filteredEntries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState 
                  icon={BookOpen}
                  title="No entries found"
                  message="You don't have any journal entries matching your filters."
                />
              </motion.div>
            ) : (
              filteredEntries.map(entry => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <JournalCard 
                    entry={entry}
                    isActive={activeEntryId === entry.id}
                    onClick={() => setActiveEntryId(entry.id)}
                    onToggleFavorite={toggleJournalFavorite}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content: Editor */}
      <motion.div variants={itemVariants} className="flex-1 flex min-h-[500px]">
        {activeEntry ? (
          <JournalEditor 
            key={activeEntry.id} // Force remount if ID changes to reset local state
            entry={activeEntry}
            onSave={updateJournalEntry}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-surfaceHighlight rounded-3xl border border-border/20 p-12 text-center">
            <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-secondary mb-2">No Entry Selected</h2>
            <p className="text-secondary max-w-sm">
              Select an entry from the sidebar to start writing, or create a new one to document your day.
            </p>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
}
