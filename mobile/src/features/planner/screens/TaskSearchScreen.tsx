/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from '../../../theme/ThemeProvider';
import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {  Search,  } from 'lucide-react-native';
import { IconButton } from '../../../design-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { TaskListItem } from '../components/TaskListItem';
import { TaskSkeleton } from '../components/TaskSkeleton';
import { EmptyPlannerState } from '../components/EmptyPlannerState';
import { useTasks } from '../hooks/useTasks';
import { useTaskMutations } from '../hooks/useTaskMutations';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const TaskSearchScreen = () => {
  const { theme } = useTheme();

  const navigation = useNavigation<NavigationProp>();
  
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Simple debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // We only fetch when there is a search query to avoid massive data pulls immediately
  const { data: tasksData, isLoading } = useTasks(debouncedQuery ? { search: debouncedQuery } : undefined);
  const { completeTask, deleteTask } = useTaskMutations();

  const handleToggleComplete = useCallback((id: string, isCompleted: boolean) => {
    completeTask.mutate({ id, completed: !isCompleted });
  }, [completeTask]);

  const renderItem = useCallback(({ item }: any) => (
    <TaskListItem
      task={item}
      onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
      onToggleComplete={() => handleToggleComplete(item.id, item.status === 'completed')}
      onDelete={() => deleteTask.mutate(item.id)}
    />
  ), [navigation, handleToggleComplete, deleteTask]);

  const listEmptyComponent = useCallback(() => {
    if (!debouncedQuery) return null;
    if (isLoading) {
      return <View><TaskSkeleton /><TaskSkeleton /></View>;
    }
    return <EmptyPlannerState isSearch />;
  }, [debouncedQuery, isLoading]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }} edges={['top']}>
      <View className="px-4 py-3 bg-background-light dark:bg-background-dark border-b border-secondary-100 dark:border-secondary-900 flex-row items-center">
        <IconButton accessibilityRole="button" accessibilityLabel="Icon Button" onPress={() => navigation.goBack()} className="mr-3" leftIcon="" />
        
        <View className="flex-1 flex-row items-center bg-surface-light dark:bg-surface-dark rounded-lg px-3 py-2">
          <Search size={20} color={theme.colors.gray[400]} />
          <TextInput
            className="flex-1 ml-2 text-base text-text-light dark:text-text-dark"
            placeholder="Search tasks..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <IconButton accessibilityRole="button" accessibilityLabel="Icon Button" onPress={() => setQuery('')} leftIcon="" />
          )}
        </View>
      </View>

      <FlatList
        data={debouncedQuery ? (tasksData?.results || []) : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
};
