import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { useAppStore } from '../store/useAppStore';
import { JournalCard } from '../components/JournalCard';
import { JournalEditor } from '../components/JournalEditor';
import type { JournalEntryModel } from '../features/journal/api/journal.types';
import { EmptyState } from '../components/ui/EmptyState';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { Button } from '../components/Button';
import { Pagination } from '../components/ui/Pagination';
import { FeatureErrorBoundary } from '../components/ui/FeatureErrorBoundary';

import { 
  useJournalEntries, 
  useCreateJournalEntry, 
  useDeleteJournalEntry, 
  useFavoriteJournalEntry 
} from '../features/journal/hooks';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Journal() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Params State
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const moodFilter = searchParams.get('mood') || 'all';
  const favoriteFilter = searchParams.get('favorite') || 'all';
  const sortBy = searchParams.get('sort') || '-created_at';

  // UI State
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [draftEntry, setDraftEntry] = useState<JournalEntryModel | null>(null);

  // Update URL Params
  const setParam = useCallback((key: string, value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value && value !== 'all') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      if (key !== 'page') newParams.set('page', '1'); // Reset page on filter change
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  // Data Fetching
  const { data: paginatedData, isLoading, isError } = useJournalEntries({
    page,
    search: searchQuery,
    mood: moodFilter !== 'all' ? moodFilter : undefined,
    is_favorite: favoriteFilter !== 'all' ? favoriteFilter : undefined,
    ordering: sortBy,
  });

  const { mutate: createEntry } = useCreateJournalEntry();
  const { mutate: deleteEntry } = useDeleteJournalEntry();
  const { mutate: toggleFavorite } = useFavoriteJournalEntry();

  const entries = paginatedData?.results || [];

  // Active Entry logic
  useEffect(() => {
    if (!activeEntryId && entries.length > 0) {
      setActiveEntryId(entries[0].id);
    }
  }, [entries, activeEntryId]);

  const activeEntry = useMemo(() => {
    if (activeEntryId === 'draft' && draftEntry) return draftEntry;
    return entries.find(e => e.id === activeEntryId);
  }, [entries, activeEntryId, draftEntry]);

  const handleNewEntry = useCallback(() => {
    const settings = useAppStore.getState().settings;
    const newDraft: JournalEntryModel = {
      id: 'draft',
      title: '',
      content: '',
      summary: '',
      mood: settings.defaultMood || 'Neutral',
      energyLevel: 0,
      stressLevel: 0,
      gratitude: '',
      todaysWins: '',
      challenges: '',
      lessonsLearned: '',
      tomorrowFocus: '',
      isFavorite: false,
      isPinned: false,
      status: 'draft',
      visibility: 'private',
      wordCount: 0,
      readingTime: 0,
      aiProcessed: false,
      aiSummary: '',
      sentimentScore: 0,
      writingScore: 0,
      aiTags: [],
      aiLastProcessed: '',
      tags: [],
      tagsDetail: [],
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    
    setDraftEntry(newDraft);
    setActiveEntryId('draft');
  }, []);

  const handleDeleteActive = useCallback(() => {
    if (activeEntryId) {
      if (window.confirm("Are you sure you want to delete this entry?")) {
        deleteEntry(activeEntryId);
        setActiveEntryId(null);
      }
    }
  }, [activeEntryId, deleteEntry]);

  if (isError) {
    return (
      <FeatureErrorBoundary featureName="Journal">
        <div className="p-8 text-danger">Failed to load journal entries. Please try again later.</div>
      </FeatureErrorBoundary>
    );
  }

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
          <SearchInput 
            value={searchQuery} 
            onChange={(v) => setParam('search', v)} 
            placeholder="Search entries..." 
          />
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <FilterBar 
            filters={[
              {
                id: 'mood', label: 'Mood', value: moodFilter, onChange: (v) => setParam('mood', v),
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
                id: 'favorite', label: 'Favorite', value: favoriteFilter, onChange: (v) => setParam('favorite', v),
                options: [
                  { label: 'All Entries', value: 'all' },
                  { label: 'Favorites', value: 'true' }
                ]
              }
            ]}
            sortBy={sortBy}
            setSortBy={(v) => setParam('sort', v)}
            sortOptions={[
              { label: 'Newest First', value: '-created_at' },
              { label: 'Oldest First', value: 'created_at' },
              { label: 'Longest', value: '-word_count' }
            ]}
          />
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-2">
          {isLoading ? (
            <div className="p-4 text-center text-secondary">Loading...</div>
          ) : (
            <AnimatePresence mode="popLayout">
              {entries.length === 0 ? (
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
                entries.map(entry => (
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
                      onToggleFavorite={() => toggleFavorite(entry.id)}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>
        
        {paginatedData?.count ? (
          <div className="pt-4 border-t border-border/20">
            <Pagination
              currentPage={page}
              totalCount={paginatedData.count || 0}
              pageSize={10}
              hasNextPage={!!paginatedData.next}
              hasPreviousPage={!!paginatedData.previous}
              onPageChange={(p) => setParam('page', p.toString())}
            />
          </div>
        ) : null}
      </motion.div>

      {/* Main Content: Editor */}
      <motion.div variants={itemVariants} className="flex-1 flex min-h-[500px]">
        {activeEntry ? (
          <JournalEditor 
            key={activeEntry.id} // Force remount if ID changes to reset local state
            entry={activeEntry}
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
