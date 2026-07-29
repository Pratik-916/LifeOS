import React, { useMemo } from 'react';
import { View } from 'react-native';
import { isToday, parseISO } from 'date-fns';
import { HeadingMD, BodyMD } from '../../../design-system';
import { useTasks } from '../../planner/hooks/useTasks';
import { useHabits } from '../../habits/hooks/useHabits';

export const ReflectionSummary = () => {
  const { data: tasksData } = useTasks();
  const { data: habitsData } = useHabits();

  const completedTasksCount = useMemo(() => {
    if (!tasksData?.results) return 0;
    return tasksData.results.filter(
      (task) => task.status === 'completed' && task.completedAt && isToday(parseISO(task.completedAt))
    ).length;
  }, [tasksData]);

  const completedHabitsCount = useMemo(() => {
    if (!habitsData?.results) return 0;
    return habitsData.results.filter(
      (habit) => habit.logs?.some(log => isToday(parseISO(log.completionDate)))
    ).length;
  }, [habitsData]);

  const hasActivity = completedTasksCount > 0 || completedHabitsCount > 0;

  return (
    <View className="mb-8 px-2">
      <HeadingMD className="text-slate-800 mb-4 font-bold">Today</HeadingMD>
      
      {hasActivity ? (
        <View className="space-y-3">
          {completedTasksCount > 0 && (
            <View className="flex-row items-center">
              <BodyMD className="text-indigo-600 mr-3">✓</BodyMD>
              <BodyMD className="text-slate-700">Finished {completedTasksCount} task{completedTasksCount === 1 ? '' : 's'}</BodyMD>
            </View>
          )}
          
          {completedHabitsCount > 0 && (
            <View className="flex-row items-center mt-2">
              <BodyMD className="text-indigo-600 mr-3">✓</BodyMD>
              <BodyMD className="text-slate-700">Completed {completedHabitsCount} habit{completedHabitsCount === 1 ? '' : 's'}</BodyMD>
            </View>
          )}

          <View className="flex-row items-center mt-2">
            <BodyMD className="text-indigo-600 mr-3">✓</BodyMD>
            <BodyMD className="text-slate-700">Stayed consistent</BodyMD>
          </View>
        </View>
      ) : (
        <View className="space-y-2 py-2">
          <BodyMD className="text-slate-700 leading-6">Showing up today mattered.</BodyMD>
          <BodyMD className="text-slate-700 leading-6 mt-1">Reflection is progress.</BodyMD>
          <BodyMD className="text-slate-700 leading-6 mt-1">Tomorrow is another opportunity.</BodyMD>
        </View>
      )}
    </View>
  );
};
