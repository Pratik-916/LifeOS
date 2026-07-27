/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useMemo } from 'react';
import { View, SectionList, RefreshControl, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isPast, isToday, startOfDay, addDays, formatISO } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

import { MainStackParamList } from '../../../navigation/types';
import { HeadingLG, HeadingMD, BodyMD, IconButton } from '../../../design-system';
import { TaskListItem } from '../components/TaskListItem';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { TaskSkeleton } from '../components/TaskSkeleton';
import { EmptyPlannerState } from '../components/EmptyPlannerState';
import { useTasks } from '../hooks/useTasks';
import { useTaskMutations } from '../hooks/useTaskMutations';
import type { Task } from '../api/planner.types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const PlannerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCompletedCollapsed, setIsCompletedCollapsed] = useState(true);

  const { data: tasksData, isLoading, refetch } = useTasks();
  const { completeTask, deleteTask, updateTask } = useTaskMutations();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const navigateToEditor = useCallback((taskId?: string) => {
    navigation.navigate('TaskEditor', { taskId });
  }, [navigation]);

  const navigateToDetails = useCallback((taskId: string) => {
    navigation.navigate('TaskDetails', { taskId });
  }, [navigation]);

  const handleToggleComplete = useCallback((id: string, isCompleted: boolean) => {
    completeTask.mutate({ id, completed: !isCompleted });
  }, [completeTask]);

  const handleDelete = useCallback((id: string) => {
    deleteTask.mutate(id);
  }, [deleteTask]);

  const handleReschedule = useCallback((id: string, target: 'today' | 'tomorrow') => {
    const targetDate = target === 'today' ? new Date() : addDays(new Date(), 1);
    updateTask.mutate({ id, payload: { dueDate: formatISO(targetDate, { representation: 'date' }) } });
  }, [updateTask]);

  // Grouping logic
  const sections = useMemo(() => {
    if (!tasksData?.results) return [];

    const overdue: Task[] = [];
    const today: Task[] = [];
    const upcoming: Task[] = [];
    const completed: Task[] = [];

    tasksData.results.forEach(task => {
      if (task.status === 'completed') {
        completed.push(task);
        return;
      }

      if (!task.dueDate) {
        upcoming.push(task);
        return;
      }

      const taskDate = startOfDay(new Date(task.dueDate));
      
      if (isToday(taskDate)) {
        today.push(task);
      } else if (isPast(taskDate)) {
        overdue.push(task);
      } else {
        upcoming.push(task);
      }
    });

    const result = [];
    
    if (overdue.length > 0) {
      result.push({ title: 'Overdue', data: overdue, color: '#EF4444' });
    }
    if (today.length > 0 || result.length === 0) {
      // Always show Today section, even if empty, to give context
      result.push({ title: 'Today', data: today, color: '#10B981' });
    }
    if (upcoming.length > 0) {
      result.push({ title: 'Upcoming', data: upcoming, color: '#3B82F6' });
    }
    if (completed.length > 0) {
      result.push({ 
        title: 'Completed', 
        data: isCompletedCollapsed ? [] : completed, 
        color: '#9CA3AF',
        count: completed.length
      });
    }

    return result;
  }, [tasksData, isCompletedCollapsed]);

  const renderSectionHeader = ({ section }: any) => {
    if (section.title === 'Completed') {
      return (
        <Pressable 
          className="flex-row items-center justify-between py-4 px-2 mt-6 border-b border-slate-100 dark:border-slate-800"
          onPress={() => setIsCompletedCollapsed(!isCompletedCollapsed)}
          hitSlop={{ top: 10, bottom: 10 }}
        >
          <View className="flex-row items-center">
            <HeadingMD className="text-slate-500">{section.title}</HeadingMD>
            <View className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full ml-3">
              <BodyMD className="text-slate-500 font-medium text-xs">{section.count}</BodyMD>
            </View>
          </View>
          {isCompletedCollapsed ? (
            <ChevronDown color="#9CA3AF" size={20} />
          ) : (
            <ChevronUp color="#9CA3AF" size={20} />
          )}
        </Pressable>
      );
    }

    return (
      <View className="flex-row items-center py-3 px-2 mt-6 border-b border-slate-100 dark:border-slate-800">
        <HeadingMD style={{ color: section.color }}>{section.title}</HeadingMD>
        <BodyMD className="text-slate-400 ml-2 font-medium">({section.data.length})</BodyMD>
      </View>
    );
  };

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View className="p-4">
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </View>
      );
    }
    // If we only have the "Today" section and it's empty, and no completed tasks
    if (sections.length === 1 && sections[0].title === 'Today' && sections[0].data.length === 0) {
      return <EmptyPlannerState type="today" onAdd={() => navigateToEditor()} />;
    }
    return <EmptyPlannerState type="empty" onAdd={() => navigateToEditor()} />;
  }, [isLoading, sections, navigateToEditor]);

  const renderItem = useCallback(({ item, section }: any) => {
    if (section.title === 'Completed' && isCompletedCollapsed) return null;
    
    const rescheduleTarget = section.title === 'Today' ? 'tomorrow' : 'today';
    const rescheduleLabel = section.title === 'Today' ? 'Tomorrow' : 'Today';

    return (
      <TaskListItem
        task={item}
        onPress={() => navigateToDetails(item.id)}
        onToggleComplete={() => handleToggleComplete(item.id, item.status === 'completed')}
        onDelete={() => handleDelete(item.id)}
        rescheduleLabel={rescheduleLabel}
        onReschedule={() => handleReschedule(item.id, rescheduleTarget)}
      />
    );
  }, [navigateToDetails, handleToggleComplete, handleDelete, handleReschedule, isCompletedCollapsed]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }} edges={['top']}>
      <View className="px-4 py-3 flex-row justify-between items-center bg-background-light dark:bg-background-dark border-b border-secondary-100 dark:border-secondary-900">
        <HeadingLG>Planner</HeadingLG>
        <IconButton 
          leftIcon="Search"
          onPress={() => navigation.navigate('TaskSearch')}
          accessibilityRole="button"
          accessibilityLabel="Search tasks"
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderEmpty}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />

      <FloatingActionButton onPress={() => navigateToEditor()} testID="fab-button" />
    </SafeAreaView>
  );
};
