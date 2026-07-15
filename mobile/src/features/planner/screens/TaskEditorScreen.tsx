import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Pressable, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {  } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { MainStackParamList } from '../../../navigation/types';
import { HeadingLG, BodyMD, Caption, Button, Loader, IconButton } from '../../../design-system';
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
        <Loader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <View className="flex-row justify-between items-center p-4 border-b border-secondary-100 dark:border-secondary-900">
        <HeadingLG>{isEditing ? 'Edit Task' : 'New Task'}</HeadingLG>
        <IconButton onPress={() => navigation.goBack()} className="p-2 -mr-2" leftIcon="" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-4">
          <Caption className="mb-2 text-gray-700 font-medium">Title</Caption>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-surface-light dark:bg-surface-dark border border-secondary-100 dark:border-secondary-900 rounded-lg p-3 text-text-light dark:text-text-dark"
                placeholder="What needs to be done?"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title && <Caption className="text-red-500 mt-1">{errors.title.message}</Caption>}
        </View>

        <View className="mb-4">
          <Caption className="mb-2 text-gray-700 font-medium">Description</Caption>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-surface-light dark:bg-surface-dark border border-secondary-100 dark:border-secondary-900 rounded-lg p-3 text-text-light dark:text-text-dark min-h-[100px]"
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
            <Caption className="mb-2 text-gray-700 font-medium">Category</Caption>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-surface-light dark:bg-surface-dark border border-secondary-100 dark:border-secondary-900 rounded-lg p-3 text-text-light dark:text-text-dark"
                  placeholder="General"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View className="flex-1 ml-2">
            <Caption className="mb-2 text-gray-700 font-medium">Est. Minutes</Caption>
            <Controller
              control={control}
              name="estimatedMinutes"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-surface-light dark:bg-surface-dark border border-secondary-100 dark:border-secondary-900 rounded-lg p-3 text-text-light dark:text-text-dark"
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
          <Caption className="mb-2 text-gray-700 font-medium">Due Date</Caption>
          <Pressable 
            onPress={() => setShowDatePicker(true)}
            className="bg-surface-light dark:bg-surface-dark border border-secondary-100 dark:border-secondary-900 rounded-lg p-3"
          >
            <BodyMD className={dueDate ? 'text-text-light dark:text-text-dark' : 'text-gray-400'}>
              {dueDate ? format(dueDate, 'PPP') : 'Select a date'}
            </BodyMD>
          </Pressable>
          {dueDate && (
            <Pressable onPress={() => setDueDate(null)} className="mt-2">
              <Caption className="text-red-500">Clear date</Caption>
            </Pressable>
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
          loading={createTask.isPending || updateTask.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
