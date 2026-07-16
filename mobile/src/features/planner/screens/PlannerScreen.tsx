/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { HeadingLG, HeadingMD, IconButton } from '../../../design-system';
import { PlannerStatisticsCard } from '../components/PlannerStatisticsCard';
import { TaskListItem } from '../components/TaskListItem';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { TaskSkeleton } from '../components/TaskSkeleton';
import { EmptyPlannerState } from '../components/EmptyPlannerState';
import { useTasks } from '../hooks/useTasks';
import { usePlannerStats } from '../hooks/usePlannerStats';
import { useTaskMutations } from '../hooks/useTaskMutations';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const PlannerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // We are passing no filters initially to get all active tasks. Pagination would ideally use useInfiniteQuery,
  // but since our backend is standard DRF with a generic paginated response, we can fetch page 1 for now 
  // or use the standard query.
  const { data: tasksData, isLoading, refetch } = useTasks();
  const { data: statsData, refetch: refetchStats } = usePlannerStats();
  const { completeTask, deleteTask } = useTaskMutations();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetch(), refetchStats()]);
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

  const renderHeader = useCallback(() => (
    <View className="mb-4">
      {statsData && <PlannerStatisticsCard stats={statsData} />}
      <HeadingMD className="mb-2 mt-4">Tasks</HeadingMD>
    </View>
  ), [statsData]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View>
          <TaskSkeleton />
          <TaskSkeleton />
          <TaskSkeleton />
        </View>
      );
    }
    return <EmptyPlannerState onAdd={() => navigateToEditor()} />;
  }, [isLoading, navigateToEditor]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderItem = useCallback(({ item }: any) => (
    <TaskListItem
      task={item}
      onPress={() => navigateToDetails(item.id)}
      onToggleComplete={() => handleToggleComplete(item.id, item.status === 'completed')}
      onDelete={() => handleDelete(item.id)}
    />
  ), [navigateToDetails, handleToggleComplete, handleDelete]);

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

      <FlatList
        data={tasksData?.results || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />

      <FloatingActionButton onPress={() => navigateToEditor()} />
    </SafeAreaView>
  );
};
