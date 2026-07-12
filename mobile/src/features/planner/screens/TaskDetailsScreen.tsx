import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Edit2, Trash2, CheckCircle2, Undo2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
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
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError || !task) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body" className="mb-4">Task not found or failed to load.</Typography>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const isCompleted = task.status === 'completed';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2" accessibilityRole="button">
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        
        <View className="flex-row space-x-4">
          {task.isArchived ? (
            <TouchableOpacity onPress={handleRestore} className="p-2" accessibilityRole="button">
              <Undo2 size={24} color="#3B82F6" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={() => navigation.navigate('TaskEditor', { taskId })} className="p-2" accessibilityRole="button">
                <Edit2 size={24} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} className="p-2" accessibilityRole="button">
                <Trash2 size={24} color="#EF4444" />
              </TouchableOpacity>
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

        <Typography variant="h1" className={`mb-4 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title}
        </Typography>

        {task.description ? (
          <Typography variant="body" className="text-gray-600 mb-6">
            {task.description}
          </Typography>
        ) : null}

        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between mb-3">
            <Typography variant="caption" className="text-gray-500 font-medium">Status</Typography>
            <Typography variant="caption" className="text-gray-900 font-medium capitalize">
              {task.status.replace('_', ' ')}
            </Typography>
          </View>
          
          {task.dueDate && (
            <View className="flex-row justify-between mb-3">
              <Typography variant="caption" className="text-gray-500 font-medium">Due Date</Typography>
              <Typography variant="caption" className="text-gray-900 font-medium">{task.dueDate}</Typography>
            </View>
          )}
          
          <View className="flex-row justify-between mb-3">
            <Typography variant="caption" className="text-gray-500 font-medium">Estimated Time</Typography>
            <Typography variant="caption" className="text-gray-900 font-medium">{task.estimatedMinutes} mins</Typography>
          </View>

          <View className="flex-row justify-between">
            <Typography variant="caption" className="text-gray-500 font-medium">Created</Typography>
            <Typography variant="caption" className="text-gray-900 font-medium">
              {new Date(task.createdAt).toLocaleDateString()}
            </Typography>
          </View>
        </View>

        {!task.isArchived && (
          <TouchableOpacity 
            onPress={handleToggleComplete}
            className={`flex-row items-center justify-center p-4 rounded-xl border-2 ${isCompleted ? 'bg-gray-100 border-gray-200' : 'bg-emerald-50 border-emerald-100'}`}
            accessibilityRole="button"
          >
            {isCompleted ? <Undo2 color="#6B7280" size={24} /> : <CheckCircle2 color="#10B981" size={24} />}
            <Typography variant="body" className={`ml-3 font-medium ${isCompleted ? 'text-gray-600' : 'text-emerald-700'}`}>
              {isCompleted ? 'Mark as Incomplete' : 'Complete Task'}
            </Typography>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
