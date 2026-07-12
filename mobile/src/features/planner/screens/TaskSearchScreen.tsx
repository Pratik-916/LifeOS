import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { TaskListItem } from '../components/TaskListItem';
import { TaskSkeleton } from '../components/TaskSkeleton';
import { EmptyPlannerState } from '../components/EmptyPlannerState';
import { useTasks } from '../hooks/useTasks';
import { useTaskMutations } from '../hooks/useTaskMutations';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const TaskSearchScreen = () => {
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

  const handleToggleComplete = (id: string, isCompleted: boolean) => {
    completeTask.mutate({ id, completed: !isCompleted });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top']}>
      <View className="px-4 py-3 bg-white border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3" accessibilityRole="button">
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search tasks..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={debouncedQuery ? (tasksData?.results || []) : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TaskListItem
            task={item}
            onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
            onToggleComplete={() => handleToggleComplete(item.id, item.status === 'completed')}
            onDelete={() => deleteTask.mutate(item.id)}
          />
        )}
        ListEmptyComponent={() => {
          if (!debouncedQuery) return null;
          if (isLoading) {
            return <View><TaskSkeleton /><TaskSkeleton /></View>;
          }
          return <EmptyPlannerState isSearch />;
        }}
      />
    </SafeAreaView>
  );
};
