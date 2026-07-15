import React from 'react';
import { View, ScrollView,  Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { HeadingXL, HeadingLG,  BodyMD, Caption, Button, IconButton, Icon, Loader } from '../../../design-system';
import { CategoryChip, FrequencyBadge, ReminderIndicator } from '../components/HabitBadges';
import { useHabit } from '../hooks/useHabit';
import { useHabitMutations } from '../hooks/useHabitMutations';
import { format } from 'date-fns';

type HabitDetailsRouteProp = RouteProp<MainStackParamList, 'HabitDetails'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const HabitDetailsScreen = () => {
  const route = useRoute<HabitDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { habitId } = route.params;

  const { data: habit, isLoading, isError } = useHabit(habitId);
  const { logHabit, deleteHabit, restoreHabit, favoriteHabit } = useHabitMutations();

  const handleLogCompletion = () => {
    if (!habit) return;
    if (habit.currentCount < habit.targetCount) {
      logHabit.mutate({
        id: habitId,
        payload: { completion_date: format(new Date(), 'yyyy-MM-dd'), count: 1 }
      });
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteHabit.mutate(habitId, {
            onSuccess: () => navigation.goBack(),
          });
        },
      },
    ]);
  };

  const handleRestore = () => {
    restoreHabit.mutate(habitId);
  };

  const toggleFavorite = () => {
    if (habit) {
      favoriteHabit.mutate({ id: habitId, isFavorite: !habit.isFavorite });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
        <Loader />
      </SafeAreaView>
    );
  }

  if (isError || !habit) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <BodyMD className="mb-4">Habit not found or failed to load.</BodyMD>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const isCompleted = habit.currentCount >= habit.targetCount;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-row justify-between items-center p-4 border-b border-secondary-100 dark:border-secondary-900">
        <IconButton leftIcon="ArrowLeft" onPress={() => navigation.goBack()} className="-ml-2" accessibilityRole="button" />
        
        <View className="flex-row space-x-2">
          {habit.isArchived ? (
            <IconButton leftIcon="Undo2" onPress={handleRestore} accessibilityRole="button" />
          ) : (
            <>
              <IconButton 
                leftIcon="Star" 
                onPress={toggleFavorite} 
                accessibilityRole="button" 
                // Color customization for IconButton could be limited, fallback to standard Icon inside  if we need fill, 
                // but let's use the standard IconButton for simplicity.
              />
              <IconButton leftIcon="Edit2" onPress={() => navigation.navigate('HabitEditor', { habitId })} accessibilityRole="button" />
              <IconButton leftIcon="Trash2" onPress={handleDelete} accessibilityRole="button" variant="danger" />
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row mb-4 flex-wrap">
          <CategoryChip category={habit.category} />
          <FrequencyBadge frequency={habit.frequency} />
          {habit.reminderEnabled && <ReminderIndicator enabled={true} />}
        </View>

        <View className="flex-row items-center mb-4">
          {habit.icon && (
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-4" 
              style={{ backgroundColor: `${habit.color || '#10B981'}20` }}
            >
              <HeadingLG>{habit.icon}</HeadingLG>
            </View>
          )}
          <HeadingXL className="text-text-light dark:text-text-dark flex-1">
            {habit.title}
          </HeadingXL>
        </View>

        {habit.description ? (
          <BodyMD className="text-text-muted mb-6">
            {habit.description}
          </BodyMD>
        ) : null}

        {/* Streaks & Stats */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-orange-50 rounded-xl p-4 flex-1 mr-2 items-center">
            <Icon name="Flame" color="#F97316" size={24} className="mb-2" />
            <HeadingLG className="text-orange-600">{habit.currentStreak}</HeadingLG>
            <Caption className="text-orange-700 font-medium">Current Streak</Caption>
          </View>
          
          <View className="bg-blue-50 rounded-xl p-4 flex-1 mx-1 items-center">
            <Icon name="Flame" color="#3B82F6" size={24} className="mb-2" />
            <HeadingLG className="text-blue-600">{habit.longestStreak}</HeadingLG>
            <Caption className="text-blue-700 font-medium">Best Streak</Caption>
          </View>
          
          <View className="bg-emerald-50 rounded-xl p-4 flex-1 ml-2 items-center">
            <Icon name="CheckCircle2" color="#10B981" size={24} className="mb-2" />
            <HeadingLG className="text-emerald-600">{habit.completionRate.toFixed(0)}%</HeadingLG>
            <Caption className="text-emerald-700 font-medium">Success</Caption>
          </View>
        </View>

        <View className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 mb-6">
          <View className="flex-row justify-between mb-3">
            <Caption className="text-text-muted font-medium">Target Progress</Caption>
            <Caption className="text-text-light dark:text-text-dark font-medium">
              {habit.currentCount} / {habit.targetCount}
            </Caption>
          </View>
          <View className="flex-row justify-between mb-3">
            <Caption className="text-text-muted font-medium">Status</Caption>
            <Caption className="text-text-light dark:text-text-dark font-medium capitalize">
              {habit.status}
            </Caption>
          </View>
          <View className="flex-row justify-between">
            <Caption className="text-text-muted font-medium">Created</Caption>
            <Caption className="text-text-light dark:text-text-dark font-medium">
              {new Date(habit.createdAt).toLocaleDateString()}
            </Caption>
          </View>
        </View>

        {!habit.isArchived && (
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            disabled={isCompleted}
            title={isCompleted ? 'Completed for today' : 'Log Completion'}
            leftIcon="CheckCircle2"
            onPress={handleLogCompletion}
            className="mb-8 mt-2"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
