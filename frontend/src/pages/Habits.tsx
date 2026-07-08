import React, { useState, useCallback, useMemo } from 'react';
import {  motion, AnimatePresence  } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { HabitCard } from '../components/HabitCard';
import { HabitModal } from '../components/HabitModal';
import { HabitStatistics } from '../components/HabitStatistics';
import type { Habit } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { useFilterSort } from '../hooks/useFilterSort';
import { Repeat } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Habits() {
  const { habits, addHabit, updateHabit, deleteHabit } = useAppStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nameAsc');

  // Filter & Sort Logic using hook
  const activeHabitsData = useMemo(() => habits.filter(h => !h.isArchived), [habits]);
  
  const filteredHabits = useFilterSort({
    data: activeHabitsData,
    searchQuery,
    searchFields: ['title', 'name'] as any,
    filters: [
      { field: 'category', value: categoryFilter },
      { field: 'frequency', value: frequencyFilter }
    ],
    sortBy,
    sortConfig: {
      nameAsc: (a, b) => {
        const aTitle = a.title || (a as any).name || '';
        const bTitle = b.title || (b as any).name || '';
        return aTitle.localeCompare(bTitle);
      },
      streakDesc: (a, b) => b.streak - a.streak,
      completionDesc: (a, b) => b.datesCompleted.length - a.datesCompleted.length
    }
  });

  // Statistics Calculation
  const stats = useMemo(() => {
    const completedToday = activeHabitsData.filter(h => h.completedToday).length;
    const completionRate = activeHabitsData.length > 0 ? Math.round((completedToday / activeHabitsData.length) * 100) : 0;
    const longestActiveStreak = activeHabitsData.reduce((max, h) => Math.max(max, h.streak), 0);
    
    return {
      totalHabits: activeHabitsData.length,
      completedToday,
      completionRate,
      longestActiveStreak
    };
  }, [activeHabitsData]);

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData as any);
    }
    setIsModalOpen(false);
    setEditingHabit(undefined);
  };

  const handleEdit = useCallback((habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(id);
    }
  }, [deleteHabit]);

  const openNewModal = useCallback(() => {
    setEditingHabit(undefined);
    setIsModalOpen(true);
  }, []);

  return (
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
        <HabitStatistics stats={stats} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surfaceHighlight p-4 rounded-2xl border border-border/20">
        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search habits..." />
        <FilterBar 
          filters={[
            {
              id: 'category', label: 'Category', value: categoryFilter, onChange: setCategoryFilter,
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
              id: 'frequency', label: 'Frequency', value: frequencyFilter, onChange: setFrequencyFilter,
              options: [
                { label: 'All Frequencies', value: 'all' },
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' }
              ]
            }
          ]}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={[
            { label: 'A-Z', value: 'nameAsc' },
            { label: 'Highest Streak', value: 'streakDesc' },
            { label: 'Highest Completion', value: 'completionDesc' }
          ]}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="w-full">
        {filteredHabits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredHabits.map((habit) => (
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

      <HabitModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingHabit(undefined); }}
        onSave={handleSaveHabit}
        initialData={editingHabit}
      />
    </motion.div>
  );
}
