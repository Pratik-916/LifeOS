import React, { useState, useCallback } from 'react';
import {  motion, AnimatePresence  } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { GoalCard } from '../components/GoalCard';
import { GoalModal } from '../components/GoalModal';
import { GoalStatistics } from '../components/GoalStatistics';
import { VisionBoard } from '../components/VisionBoard';
import type { Goal } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { useFilterSort } from '../hooks/useFilterSort';
import { Target } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useAppStore();
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  
  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('targetDateAsc');

  const handleNewGoal = useCallback(() => {
    setEditingGoal(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditGoal = useCallback((goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  }, []);

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData as Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progress'>);
    }
  };

  const filteredGoals = useFilterSort({
    data: goals,
    searchQuery,
    searchFields: ['title', 'description'],
    filters: [
      { field: 'status', value: statusFilter },
      { field: 'category', value: categoryFilter },
      { field: 'priority', value: priorityFilter },
    ],
    sortBy,
    sortConfig: {
      targetDateAsc: (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime(),
      targetDateDesc: (a, b) => new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime(),
      progressDesc: (a, b) => (b.progress || 0) - (a.progress || 0),
      progressAsc: (a, b) => (a.progress || 0) - (b.progress || 0),
    }
  });

  return (
    <motion.div 
      className="space-y-8 pb-10 max-w-[1200px] mx-auto min-h-[calc(100vh-4rem)]"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <PageHeader 
        title="Goals"
        description="Set intentions, track milestones, and visualize success."
        actionLabel="New Goal"
        onAction={handleNewGoal}
      />

      <GoalStatistics goals={goals} />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surfaceHighlight p-4 rounded-2xl border border-border/20">
        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search goals..." />
        <FilterBar 
          filters={[
            {
              id: 'status', label: 'Status', value: statusFilter, onChange: setStatusFilter,
              options: [
                { label: 'All Statuses', value: 'all' },
                { label: 'Not Started', value: 'Not Started' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' }
              ]
            },
            {
              id: 'category', label: 'Category', value: categoryFilter, onChange: setCategoryFilter,
              options: [
                { label: 'All Categories', value: 'all' },
                { label: 'Career', value: 'Career' },
                { label: 'Health', value: 'Health' },
                { label: 'Finance', value: 'Finance' },
                { label: 'Personal', value: 'Personal' }
              ]
            },
            {
              id: 'priority', label: 'Priority', value: priorityFilter, onChange: setPriorityFilter,
              options: [
                { label: 'All Priorities', value: 'all' },
                { label: 'High', value: 'High' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Low', value: 'Low' }
              ]
            }
          ]}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={[
            { label: 'Target Date (Earliest)', value: 'targetDateAsc' },
            { label: 'Target Date (Latest)', value: 'targetDateDesc' },
            { label: 'Progress (High to Low)', value: 'progressDesc' },
            { label: 'Progress (Low to High)', value: 'progressAsc' }
          ]}
        />
      </div>

      <div className="space-y-4 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {filteredGoals.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState 
                icon={Target}
                title="No goals found"
                message="You haven't set any goals that match your current filters."
              />
            </motion.div>
          ) : (
            filteredGoals.map(goal => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <GoalCard 
                  goal={goal} 
                  onEdit={handleEditGoal}
                  onDelete={deleteGoal}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <VisionBoard />

      <GoalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGoal}
        initialData={editingGoal}
      />
    </motion.div>
  );
}
