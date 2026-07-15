import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
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
import { useTheme } from '../../../theme/ThemeProvider';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const PlannerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
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

  const navigateToEditor = (taskId?: string) => {
    navigation.navigate('TaskEditor', { taskId });
  };

  const navigateToDetails = (taskId: string) => {
    navigation.navigate('TaskDetails', { taskId });
  };

  const handleToggleComplete = (id: string, isCompleted: boolean) => {
    completeTask.mutate({ id, completed: !isCompleted });
  };

  const handleDelete = (id: string) => {
    deleteTask.mutate(id);
  };

  const renderHeader = () => (
    <View className="mb-4">
      {statsData && <PlannerStatisticsCard stats={statsData} />}
      <HeadingMD className="mb-2 mt-4">Tasks</HeadingMD>
    </View>
  );

  const renderEmpty = () => {
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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top']}>
      <View className="px-4 py-3 flex-row justify-between items-center bg-white border-b border-gray-200">
        <HeadingLG>Planner</HeadingLG>
        <IconButton 
          onPress={() => navigation.navigate('TaskSearch')}
          leftIcon="Search"
        />
      </View>

      <FlatList
        data={tasksData?.results || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TaskListItem
            task={item}
            onPress={() => navigateToDetails(item.id)}
            onToggleComplete={() => handleToggleComplete(item.id, item.status === 'completed')}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />

      <FloatingActionButton onPress={() => navigateToEditor()} />
    </SafeAreaView>
  );
};
