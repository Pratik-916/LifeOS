import { useMemo } from 'react';
import { useTasks } from '../../planner/hooks/useTasks';
import { useHabits } from '../../habits/hooks/useHabits';
import { useGoals } from '../../goals/hooks/useGoals';
import { useJournalEntries } from '../../journal/hooks/useJournalEntries';
import { insightEngine } from '../api/engine/InsightEngine';
import type { Insight } from '../api/insights.types';

export const useInsights = () => {
  // We fetch a broad set of data to provide to the engine
  const { data: tasksData, isLoading: loadingTasks } = useTasks({});
  const { data: habitsData, isLoading: loadingHabits } = useHabits({ page_size: 100 });
  const { data: goalsData, isLoading: loadingGoals } = useGoals({ status: 'in_progress', page_size: 100 });
  const { data: journalData, isLoading: loadingJournal } = useJournalEntries({ page_size: 100 });

  const isLoading = loadingTasks || loadingHabits || loadingGoals || loadingJournal;

  const insights: Insight[] = useMemo(() => {
    if (isLoading) return [];
    
    return insightEngine.evaluate({
      tasks: tasksData?.results || [],
      habits: habitsData?.results || [],
      goals: goalsData?.results || [],
      journalEntries: journalData?.results || []
    });
  }, [isLoading, tasksData, habitsData, goalsData, journalData]);

  return { insights, isLoading };
};
