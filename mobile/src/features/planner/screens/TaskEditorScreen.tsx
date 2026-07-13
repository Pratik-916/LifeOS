import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { MainStackParamList } from '../../../navigation/types';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { useTask } from '../hooks/useTask';
import { useTaskMutations } from '../hooks/useTaskMutations';

const DRAFT_KEY = '@planner_draft';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  category: z.string().optional().default('General'),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
  estimatedMinutes: z.coerce.number().min(0).default(0),
});

type TaskFormData = z.infer<typeof taskSchema>;

type TaskEditorRouteProp = RouteProp<MainStackParamList, 'TaskEditor'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const TaskEditorScreen = () => {
  const route = useRoute<TaskEditorRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const taskId = route.params?.taskId;
  const isEditing = !!taskId;

  const { data: existingTask, isLoading } = useTask(taskId || '', { enabled: isEditing });
  const { createTask, updateTask } = useTaskMutations();

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<TaskFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      category: 'General',
      priority: 'low',
      estimatedMinutes: 0,
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = watch();

  useEffect(() => {
    const loadDraft = async () => {
      if (isEditing && existingTask) {
        reset({
          title: existingTask.title,
          description: existingTask.description,
          category: existingTask.category,
          priority: existingTask.priority,
          estimatedMinutes: existingTask.estimatedMinutes,
        });
        if (existingTask.dueDate) {
          setDueDate(new Date(existingTask.dueDate));
        }
      } else if (!isEditing) {
        const draftStr = await AsyncStorage.getItem(DRAFT_KEY);
        if (draftStr) {
          const draft = JSON.parse(draftStr);
          reset(draft);
          if (draft.dueDate) {
            setDueDate(new Date(draft.dueDate));
          }
        }
      }
    };
    loadDraft();
  }, [isEditing, existingTask, reset]);

  // Persist draft for new tasks
  useEffect(() => {
    if (!isEditing) {
      const saveDraft = setTimeout(() => {
        AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ ...formValues, dueDate: dueDate?.toISOString() }));
      }, 1000);
      return () => clearTimeout(saveDraft);
    }
  }, [formValues, dueDate, isEditing]);

  const onSubmit = async (data: TaskFormData) => {
    const formattedDate = dueDate ? format(dueDate, 'yyyy-MM-dd') : null;
    const payload = {
      ...data,
      dueDate: formattedDate,
    };

    if (isEditing) {
      updateTask.mutate({ id: taskId!, payload }, {
        onSuccess: () => navigation.goBack()
      });
    } else {
      createTask.mutate(payload, {
        onSuccess: async () => {
          await AsyncStorage.removeItem(DRAFT_KEY);
          navigation.goBack();
        }
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  if (isEditing && isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
        <Typography variant="h2">{isEditing ? 'Edit Task' : 'New Task'}</Typography>
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -mr-2" accessibilityRole="button">
          <X size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-4">
          <Typography variant="caption" className="mb-2 text-gray-700 font-medium">Title</Typography>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900"
                placeholder="What needs to be done?"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title && <Typography variant="caption" className="text-red-500 mt-1">{errors.title.message}</Typography>}
        </View>

        <View className="mb-4">
          <Typography variant="caption" className="mb-2 text-gray-700 font-medium">Description</Typography>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 min-h-[100px]"
                placeholder="Add details..."
                multiline
                textAlignVertical="top"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>

        <View className="flex-row mb-4 space-x-4">
          <View className="flex-1 mr-2">
            <Typography variant="caption" className="mb-2 text-gray-700 font-medium">Category</Typography>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900"
                  placeholder="General"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View className="flex-1 ml-2">
            <Typography variant="caption" className="mb-2 text-gray-700 font-medium">Est. Minutes</Typography>
            <Controller
              control={control}
              name="estimatedMinutes"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900"
                  placeholder="0"
                  keyboardType="numeric"
                  onChangeText={(val) => onChange(parseInt(val, 10) || 0)}
                  value={String(value)}
                />
              )}
            />
          </View>
        </View>

        <View className="mb-6">
          <Typography variant="caption" className="mb-2 text-gray-700 font-medium">Due Date</Typography>
          <TouchableOpacity 
            onPress={() => setShowDatePicker(true)}
            className="bg-gray-50 border border-gray-200 rounded-lg p-3"
          >
            <Typography variant="body" className={dueDate ? 'text-gray-900' : 'text-gray-400'}>
              {dueDate ? format(dueDate, 'PPP') : 'Select a date'}
            </Typography>
          </TouchableOpacity>
          {dueDate && (
            <TouchableOpacity onPress={() => setDueDate(null)} className="mt-2">
              <Typography variant="caption" className="text-red-500">Clear date</Typography>
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <Button 
          title={isEditing ? 'Save Changes' : 'Create Task'} 
          onPress={handleSubmit(onSubmit)} 
          isLoading={createTask.isPending || updateTask.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
