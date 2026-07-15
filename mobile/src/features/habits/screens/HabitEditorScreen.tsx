import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { MainStackParamList } from '../../../navigation/types';
import { HeadingLG, BodyMD, Caption, Button, IconButton, Icon, Loader, SelectableChip } from '../../../design-system';
import { useHabit } from '../hooks/useHabit';
import { useHabitMutations } from '../hooks/useHabitMutations';

const DRAFT_KEY = '@habit_draft';

const habitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  category: z.string().optional().default('General'),
  frequency: z.enum(['daily', 'weekly']).default('daily'),
  targetCount: z.coerce.number().min(1).default(1),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
  reminderEnabled: z.boolean().default(false),
  reminderTime: z.string().optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

type HabitEditorRouteProp = RouteProp<MainStackParamList, 'HabitEditor'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const HabitEditorScreen = () => {
  const route = useRoute<HabitEditorRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const habitId = route.params?.habitId;
  const isEditing = !!habitId;

  const { data: existingHabit, isLoading } = useHabit(habitId || '', { enabled: isEditing });
  const { createHabit, updateHabit } = useHabitMutations();

  const [reminderTimeObj, setReminderTimeObj] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema) as unknown as Resolver<HabitFormData>,
    defaultValues: {
      title: '',
      description: '',
      category: 'General',
      frequency: 'daily',
      targetCount: 1,
      priority: 'low',
      reminderEnabled: false,
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const formValues = watch();

  useEffect(() => {
    const loadDraft = async () => {
      if (isEditing && existingHabit) {
        reset({
          title: existingHabit.title,
          description: existingHabit.description,
          category: existingHabit.category,
          frequency: existingHabit.frequency,
          targetCount: existingHabit.targetCount,
          priority: existingHabit.priority,
          reminderEnabled: existingHabit.reminderEnabled,
          reminderTime: existingHabit.reminderTime || undefined,
        });
        if (existingHabit.reminderTime) {
          // parse HH:mm:ss if present
          const [hours, minutes] = existingHabit.reminderTime.split(':');
          const d = new Date();
          d.setHours(parseInt(hours, 10));
          d.setMinutes(parseInt(minutes, 10));
          setReminderTimeObj(d);
        }
      } else if (!isEditing) {
        const draftStr = await AsyncStorage.getItem(DRAFT_KEY);
        if (draftStr) {
          const draft = JSON.parse(draftStr);
          reset(draft);
          if (draft.reminderTime) {
            const [hours, minutes] = draft.reminderTime.split(':');
            const d = new Date();
            d.setHours(parseInt(hours, 10));
            d.setMinutes(parseInt(minutes, 10));
            setReminderTimeObj(d);
          }
        }
      }
    };
    loadDraft();
  }, [isEditing, existingHabit, reset]);

  // Persist draft for new habits
  useEffect(() => {
    if (!isEditing) {
      const saveDraft = setTimeout(() => {
        AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
      }, 1000);
      return () => clearTimeout(saveDraft);
    }
  }, [formValues, isEditing]);

  const onSubmit = async (data: HabitFormData) => {
    const payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      frequency: data.frequency,
      target_count: data.targetCount,
      priority: data.priority,
      reminder_enabled: data.reminderEnabled,
      reminder_time: data.reminderTime,
    };

    if (isEditing) {
      updateHabit.mutate({ id: habitId!, payload }, {
        onSuccess: () => navigation.goBack()
      });
    } else {
      createHabit.mutate(payload, {
        onSuccess: async () => {
          await AsyncStorage.removeItem(DRAFT_KEY);
          navigation.goBack();
        }
      });
    }
  };

  const handleTimeChange = (event: unknown, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setReminderTimeObj(selectedDate);
      setValue('reminderTime', format(selectedDate, 'HH:mm:ss'));
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
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
        <HeadingLG>{isEditing ? 'Edit Habit' : 'New Habit'}</HeadingLG>
        <IconButton leftIcon="X" onPress={() => navigation.goBack()} className="-mr-2" accessibilityRole="button" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-4">
          <Caption className="mb-2 text-gray-700 font-medium">Title</Caption>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900"
                placeholder="E.g., Read for 30 minutes"
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
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 min-h-[100px]"
                placeholder="Why do you want to build this habit?"
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
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900"
                  placeholder="Health"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <View className="flex-1 ml-2">
            <Caption className="mb-2 text-gray-700 font-medium">Target Count</Caption>
            <Controller
              control={control}
              name="targetCount"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900"
                  placeholder="1"
                  keyboardType="numeric"
                  onChangeText={(val) => onChange(parseInt(val, 10) || 1)}
                  value={String(value)}
                />
              )}
            />
          </View>
        </View>

        <View className="mb-6">
          <Caption className="mb-2 text-gray-700 font-medium">Frequency</Caption>
          <Controller
            control={control}
            name="frequency"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row items-center space-x-2">
                <SelectableChip
                  label="Daily"
                  icon="Calendar"
                  selected={value === 'daily'}
                  onPress={() => onChange('daily')}
                />
                <SelectableChip
                  label="Weekly"
                  icon="CalendarDays"
                  selected={value === 'weekly'}
                  onPress={() => onChange('weekly')}
                  className="ml-2"
                />
              </View>
            )}
          />
        </View>

        <View className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <View className="flex-row justify-between items-center mb-2">
            <BodyMD className="font-medium text-gray-900">Enable Reminders</BodyMD>
            <Controller
              control={control}
              name="reminderEnabled"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                  thumbColor={value ? '#10B981' : '#F3F4F6'}
                />
              )}
            />
          </View>
          
          {formValues.reminderEnabled && (
            <View className="mt-2">
              <Button
                variant="outline"
                title={reminderTimeObj ? format(reminderTimeObj, 'hh:mm a') : 'Select a time'}
                onPress={() => setShowTimePicker(true)}
                className="bg-white justify-start"
                textClassName={`font-normal ${reminderTimeObj ? 'text-gray-900' : 'text-gray-400'}`}
              />
              
              {showTimePicker && (
                <DateTimePicker
                  value={reminderTimeObj || new Date()}
                  mode="time"
                  display="default"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={handleTimeChange}
                />
              )}
            </View>
          )}
        </View>

        <Button 
          title={isEditing ? 'Save Habit' : 'Create Habit'} 
          onPress={handleSubmit(onSubmit)} 
          loading={createHabit.isPending || updateHabit.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
