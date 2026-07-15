import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {      } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { HeadingXL, BodyMD, Caption, Button, Loader, IconButton } from '../../../design-system';
import { CategoryBadge } from '../components/CategoryBadge';
import { PriorityPill } from '../components/PriorityPill';
import { useTask } from '../hooks/useTask';
import { useTaskMutations } from '../hooks/useTaskMutations';

type TaskDetailsRouteProp = RouteProp<MainStackParamList, 'TaskDetails'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const TaskDetailsScreen = () => {
  const route = useRoute<TaskDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { taskId } = route.params;

  const { data: task, isLoading, isError } = useTask(taskId);
  const { completeTask, deleteTask, restoreTask } = useTaskMutations();

  const handleToggleComplete = () => {
    if (!task) return;
    completeTask.mutate({ id: task.id, completed: task.status !== 'completed' });
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask.mutate(taskId, {
            onSuccess: () => navigation.goBack(),
          });
        },
      },
    ]);
  };

  const handleRestore = () => {
    restoreTask.mutate(taskId);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
        <Loader />
      </SafeAreaView>
    );
  }

  if (isError || !task) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <BodyMD className="mb-4">Task not found or failed to load.</BodyMD>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const isCompleted = task.status === 'completed';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-row justify-between items-center p-4 border-b border-secondary-100 dark:border-secondary-900">
        <IconButton onPress={() => navigation.goBack()} className="p-2 -ml-2" leftIcon="" />
        
        <View className="flex-row space-x-4">
          {task.isArchived ? (
            <IconButton onPress={handleRestore} className="p-2" leftIcon="" />
          ) : (
            <>
              <IconButton onPress={() => navigation.navigate('TaskEditor', { taskId })} className="p-2" leftIcon="" />
              <IconButton onPress={handleDelete} className="p-2" leftIcon="" />
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row mb-4 flex-wrap">
          <CategoryBadge category={task.category} />
          <View className="ml-2">
            <PriorityPill priority={task.priority} />
          </View>
        </View>

        <HeadingXL className={`mb-4 ${isCompleted ? 'line-through text-text-muted' : 'text-text-light dark:text-text-dark'}`}>
          {task.title}
        </HeadingXL>

        {task.description ? (
          <BodyMD className="text-text-muted mb-6">
            {task.description}
          </BodyMD>
        ) : null}

        <View className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 mb-6">
          <View className="flex-row justify-between mb-3">
            <Caption className="text-text-muted font-medium">Status</Caption>
            <Caption className="text-text-light dark:text-text-dark font-medium capitalize">
              {task.status.replace('_', ' ')}
            </Caption>
          </View>
          
          {task.dueDate && (
            <View className="flex-row justify-between mb-3">
              <Caption className="text-text-muted font-medium">Due Date</Caption>
              <Caption className="text-text-light dark:text-text-dark font-medium">{task.dueDate}</Caption>
            </View>
          )}
          
          <View className="flex-row justify-between mb-3">
            <Caption className="text-text-muted font-medium">Estimated Time</Caption>
            <Caption className="text-text-light dark:text-text-dark font-medium">{task.estimatedMinutes} mins</Caption>
          </View>

          <View className="flex-row justify-between">
            <Caption className="text-text-muted font-medium">Created</Caption>
            <Caption className="text-text-light dark:text-text-dark font-medium">
              {new Date(task.createdAt).toLocaleDateString()}
            </Caption>
          </View>
        </View>

        {!task.isArchived && (
          <Button 
            onPress={handleToggleComplete}
            variant={isCompleted ? 'secondary' : 'primary'}
            title={isCompleted ? 'Mark as Incomplete' : 'Complete Task'}
            leftIcon={isCompleted ? '' : ''}
            className="mt-2"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
