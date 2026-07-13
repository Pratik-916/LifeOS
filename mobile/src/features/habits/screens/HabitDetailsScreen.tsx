import React from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Edit2, Trash2, CheckCircle2, Undo2, Star, Flame } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
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
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (isError || !habit) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body" className="mb-4">Habit not found or failed to load.</Typography>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const isCompleted = habit.currentCount >= habit.targetCount;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2" accessibilityRole="button">
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        
        <View className="flex-row space-x-2">
          {habit.isArchived ? (
            <TouchableOpacity onPress={handleRestore} className="p-2" accessibilityRole="button">
              <Undo2 size={24} color="#3B82F6" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={toggleFavorite} className="p-2" accessibilityRole="button">
                <Star size={24} color={habit.isFavorite ? "#F59E0B" : "#D1D5DB"} fill={habit.isFavorite ? "#F59E0B" : "transparent"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('HabitEditor', { habitId })} className="p-2" accessibilityRole="button">
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
              <Typography variant="h2">{habit.icon}</Typography>
            </View>
          )}
          <Typography variant="h1" className="text-gray-900 flex-1">
            {habit.title}
          </Typography>
        </View>

        {habit.description ? (
          <Typography variant="body" className="text-gray-600 mb-6">
            {habit.description}
          </Typography>
        ) : null}

        {/* Streaks & Stats */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-orange-50 rounded-xl p-4 flex-1 mr-2 items-center">
            <Flame color="#F97316" size={24} className="mb-2" />
            <Typography variant="h2" className="text-orange-600">{habit.currentStreak}</Typography>
            <Typography variant="caption" className="text-orange-700 font-medium">Current Streak</Typography>
          </View>
          
          <View className="bg-blue-50 rounded-xl p-4 flex-1 mx-1 items-center">
            <Flame color="#3B82F6" size={24} className="mb-2" />
            <Typography variant="h2" className="text-blue-600">{habit.longestStreak}</Typography>
            <Typography variant="caption" className="text-blue-700 font-medium">Best Streak</Typography>
          </View>
          
          <View className="bg-emerald-50 rounded-xl p-4 flex-1 ml-2 items-center">
            <CheckCircle2 color="#10B981" size={24} className="mb-2" />
            <Typography variant="h2" className="text-emerald-600">{habit.completionRate.toFixed(0)}%</Typography>
            <Typography variant="caption" className="text-emerald-700 font-medium">Success</Typography>
          </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between mb-3">
            <Typography variant="caption" className="text-gray-500 font-medium">Target Progress</Typography>
            <Typography variant="caption" className="text-gray-900 font-medium">
              {habit.currentCount} / {habit.targetCount}
            </Typography>
          </View>
          <View className="flex-row justify-between mb-3">
            <Typography variant="caption" className="text-gray-500 font-medium">Status</Typography>
            <Typography variant="caption" className="text-gray-900 font-medium capitalize">
              {habit.status}
            </Typography>
          </View>
          <View className="flex-row justify-between">
            <Typography variant="caption" className="text-gray-500 font-medium">Created</Typography>
            <Typography variant="caption" className="text-gray-900 font-medium">
              {new Date(habit.createdAt).toLocaleDateString()}
            </Typography>
          </View>
        </View>

        {!habit.isArchived && (
          <TouchableOpacity 
            onPress={handleLogCompletion}
            disabled={isCompleted}
            className={`flex-row items-center justify-center p-4 rounded-xl border-2 ${isCompleted ? 'bg-gray-100 border-gray-200' : 'bg-emerald-50 border-emerald-100'}`}
            accessibilityRole="button"
          >
            {isCompleted ? <CheckCircle2 color="#9CA3AF" size={24} /> : <CheckCircle2 color="#10B981" size={24} />}
            <Typography variant="body" className={`ml-3 font-medium ${isCompleted ? 'text-gray-400' : 'text-emerald-700'}`}>
              {isCompleted ? 'Completed for today' : 'Log Completion'}
            </Typography>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
