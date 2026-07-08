import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { GoalCard } from '../components/GoalCard';
import { GoalModal } from '../components/GoalModal';
import { GoalStatistics } from '../components/GoalStatistics';
import { VisionBoard } from '../components/VisionBoard';
import type { Goal } from '../types';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterBar } from '../components/ui/FilterBar';
import { Pagination } from '../components/ui/Pagination';
import { Target } from 'lucide-react';
import { FeatureErrorBoundary } from '../components/ui/FeatureErrorBoundary';

import { useGoals, useDeleteGoal, useRestoreGoal } from '../features/goals/hooks';
import type { GetGoalsFilters } from '../features/goals/api/goals.types';
import { goalsKeys } from '../features/goals/api/goals.keys';
import { goalsApi } from '../features/goals/api/goals';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function GoalsContent() {
  const queryClient = useQueryClient();
  const deleteGoalMutation = useDeleteGoal();
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  
  // URL State for Filters
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'all';
  const priorityFilter = searchParams.get('priority') || 'all';
  const categoryFilter = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'targetDateAsc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const updateSearchParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const setSearchQuery = (val: string) => updateSearchParam('search', val);
  const setStatusFilter = (val: string) => updateSearchParam('status', val);
  const setPriorityFilter = (val: string) => updateSearchParam('priority', val);
  const setCategoryFilter = (val: string) => updateSearchParam('category', val);
  const setSortBy = (val: string) => updateSearchParam('sort', val);

  // Backend Integration
  const filters: GetGoalsFilters = { page };
  if (statusFilter !== 'all') filters.status = statusFilter;
  if (priorityFilter !== 'all') filters.priority = priorityFilter;
  if (categoryFilter !== 'all') filters.category = categoryFilter;
  if (searchQuery) filters.search = searchQuery;

  if (sortBy === 'targetDateAsc') { filters.sort_by = 'target_date'; filters.sort_order = 'asc'; }
  else if (sortBy === 'targetDateDesc') { filters.sort_by = 'target_date'; filters.sort_order = 'desc'; }
  else if (sortBy === 'progressDesc') { filters.sort_by = 'progress'; filters.sort_order = 'desc'; }
  else if (sortBy === 'progressAsc') { filters.sort_by = 'progress'; filters.sort_order = 'asc'; }

  const { data, isLoading } = useGoals(filters);
  const goals = useMemo(() => data?.results || [], [data?.results]);
  const totalCount = data?.count || 0;

  // Prefetch next page
  useEffect(() => {
    if (data?.next) {
      const nextFilters = { ...filters, page: page + 1 };
      queryClient.prefetchQuery({
        queryKey: goalsKeys.list(nextFilters),
        queryFn: () => goalsApi.getGoals(nextFilters),
        staleTime: 30 * 1000,
      });
    }
  }, [data, filters, page, queryClient]);

  const handleNewGoal = useCallback(() => {
    setEditingGoal(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditGoal = useCallback((goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  }, []);

  // Deletion with Undo Toast will be handled inside GoalCard/Toast system.
  const handleDeleteGoal = useCallback((id: string) => {
    deleteGoalMutation.mutate(id);
  }, [deleteGoalMutation]);

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

      <GoalStatistics />

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
        {isLoading && goals.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {goals.length === 0 ? (
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
              goals.map(goal => (
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
                    onDelete={handleDeleteGoal}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      {!isLoading && totalCount > 10 && (
        <Pagination
          currentPage={page}
          totalCount={totalCount}
          hasNextPage={!!data?.next}
          hasPreviousPage={!!data?.previous}
          onPageChange={(p) => updateSearchParam('page', p.toString())}
        />
      )}

      <VisionBoard />

      <GoalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingGoal}
      />
    </motion.div>
  );
}

export default function Goals() {
  return (
    <FeatureErrorBoundary featureName="Goals">
      <GoalsContent />
    </FeatureErrorBoundary>
  );
}

