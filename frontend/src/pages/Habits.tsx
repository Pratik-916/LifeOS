import React, { useState, useCallback } from 'react';
import {  motion, AnimatePresence  } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { HabitCard } from '../components/HabitCard';
import { HabitModal } from '../components/HabitModal';
import { HabitStatistics } from '../components/HabitStatistics';
import type { HabitModel } from '../features/habits/api/habits.types';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { Pagination } from '../components/ui/Pagination';
import { Repeat } from 'lucide-react';
import { useHabits, useCreateHabit, useUpdateHabit, useDeleteHabit } from '../features/habits/hooks';
import { FeatureErrorBoundary } from '../components/ui/FeatureErrorBoundary';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Habits() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitModel | undefined>(undefined);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || 'all';
  const frequencyFilter = searchParams.get('frequency') || 'all';
  const sortBy = searchParams.get('ordering') || 'title';

  const { data: habitsData, isLoading } = useHabits({
    page,
    search: searchQuery || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    frequency: frequencyFilter !== 'all' ? frequencyFilter : undefined,
    ordering: sortBy,
    is_archived: false,
  });

  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();

  const updateSearchParam = (key: string, value: string) => {
    setSearchParams(prev => {
      if (value === 'all' || !value) {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      if (key !== 'page') prev.set('page', '1');
      return prev;
    }, { replace: true });
  };

  const handleSaveHabit = (payload: any) => {
    if (editingHabit) {
      updateHabit.mutate({ id: editingHabit.id, payload });
    } else {
      createHabit.mutate(payload);
    }
    setIsModalOpen(false);
    setEditingHabit(undefined);
  };

  const handleEdit = useCallback((habit: HabitModel) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteHabit.mutate(id);
  }, [deleteHabit]);

  const openNewModal = useCallback(() => {
    setEditingHabit(undefined);
    setIsModalOpen(true);
  }, []);

  const totalCount = habitsData?.count || 0;
  const filteredHabits: HabitModel[] = habitsData?.results || [];

  return (
    <FeatureErrorBoundary featureName="Habits">
      <motion.div 
        className="space-y-8 pb-10 max-w-[1200px] mx-auto min-h-[calc(100vh-4rem)]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <PageHeader 
          title="Habits"
          description="Build consistency and track your daily progress."
          actionLabel="New Habit"
          onAction={openNewModal}
        />

        <motion.div variants={itemVariants} className="w-full">
          <HabitStatistics />
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surfaceHighlight p-4 rounded-2xl border border-border/20">
          <SearchInput 
            value={searchQuery} 
            onChange={(val) => updateSearchParam('search', val)} 
            placeholder="Search habits..." 
          />
          <FilterBar 
            filters={[
              {
                id: 'category', label: 'Category', value: categoryFilter, onChange: (val) => updateSearchParam('category', val),
                options: [
                  { label: 'All Categories', value: 'all' },
                  { label: 'Health', value: 'Health' },
                  { label: 'Learning', value: 'Learning' },
                  { label: 'Work', value: 'Work' },
                  { label: 'Personal', value: 'Personal' },
                  { label: 'Finance', value: 'Finance' },
                  { label: 'Other', value: 'Other' }
                ]
              },
              {
                id: 'frequency', label: 'Frequency', value: frequencyFilter, onChange: (val) => updateSearchParam('frequency', val),
                options: [
                  { label: 'All Frequencies', value: 'all' },
                  { label: 'Daily', value: 'daily' },
                  { label: 'Weekly', value: 'weekly' }
                ]
              }
            ]}
            sortBy={sortBy}
            setSortBy={(val) => updateSearchParam('ordering', val)}
            sortOptions={[
              { label: 'A-Z', value: 'title' },
              { label: 'Highest Streak', value: '-current_streak' },
              { label: 'Highest Completion', value: '-completion_rate' }
            ]}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-surfaceHighlight animate-pulse border border-border/20" />
              ))}
            </div>
          ) : filteredHabits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredHabits.map((habit: HabitModel) => (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HabitCard 
                      habit={habit} 
                      onEdit={handleEdit} 
                      onDelete={handleDelete} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState 
              icon={Repeat}
              title="No habits found"
              message="You haven't set any habits that match your filters, or you haven't created one yet."
            />
          )}
        </motion.div>

        {!isLoading && totalCount > 10 && (
          <Pagination
            currentPage={page}
            totalCount={totalCount}
            onPageChange={(p) => updateSearchParam('page', p.toString())}
            hasNextPage={!!habitsData?.next}
            hasPreviousPage={!!habitsData?.previous}
          />
        )}

        <HabitModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingHabit(undefined); }}
          onSave={handleSaveHabit}
          initialData={editingHabit}
        />
      </motion.div>
    </FeatureErrorBoundary>
  );
}
