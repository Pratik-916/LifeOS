/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useMemo } from 'react';
import { View, FlatList, RefreshControl, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { HeadingLG, HeadingMD, IconButton, FloatingActionButton, BodySM } from '../../../design-system';
import { HabitCard } from '../components/HabitCard';
import { HabitSkeleton } from '../components/HabitSkeleton';
import { EmptyHabitsState } from '../components/EmptyHabitsState';
import { useHabits } from '../hooks/useHabits';
import { useHabitMutations } from '../hooks/useHabitMutations';
import { format } from 'date-fns';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const HabitScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());

  const { data: habitsData, isLoading, refetch } = useHabits({ status: 'active' });
  const { logHabit } = useHabitMutations();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const navigateToEditor = (habitId?: string) => {
    navigation.navigate('HabitEditor', { habitId });
  };

  const navigateToDetails = (habitId: string) => {
    navigation.navigate('HabitDetails', { habitId });
  };

  const handleLogCompletion = (id: string, currentCount: number, targetCount: number) => {
    if (currentCount < targetCount) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      logHabit.mutate({ 
        id, 
        payload: { completion_date: format(new Date(), 'yyyy-MM-dd'), count: 1 }
      });
    }
  };

  const handleSkip = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSkippedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // Log as count 0 to record the skip action without breaking streak if backend supports it
    logHabit.mutate({
      id,
      payload: { completion_date: format(new Date(), 'yyyy-MM-dd'), count: 0, notes: 'skipped' }
    });
  };

  const allCompleted = habitsData?.results && habitsData.results.length > 0 && habitsData.results.every(h => h.currentCount >= h.targetCount || skippedIds.has(h.id));

  const renderHeader = useCallback(() => (
    <View className="mb-6 mt-2">
      {allCompleted ? (
        <>
          <HeadingMD className="text-slate-800">You're all set for today.</HeadingMD>
          <BodySM className="text-slate-500 mt-1">Take a moment to enjoy it.</BodySM>
        </>
      ) : (
        <>
          <HeadingMD className="text-slate-800">Today's small actions.</HeadingMD>
          <BodySM className="text-slate-500 mt-1">One step at a time.</BodySM>
        </>
      )}
    </View>
  ), [allCompleted]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View>
          <HabitSkeleton />
          <HabitSkeleton />
          <HabitSkeleton />
        </View>
      );
    }
    return <EmptyHabitsState onAdd={() => navigateToEditor()} />;
  }, [isLoading]);

  const sortedHabits = useMemo(() => {
    if (!habitsData?.results) return [];
    
    return [...habitsData.results].sort((a, b) => {
      const aCompleted = a.currentCount >= a.targetCount || skippedIds.has(a.id);
      const bCompleted = b.currentCount >= b.targetCount || skippedIds.has(b.id);
      
      if (aCompleted && !bCompleted) return 1;
      if (!aCompleted && bCompleted) return -1;
      return 0;
    });
  }, [habitsData, skippedIds]);

  const renderItem = useCallback(({ item }: any) => {
    const isEffectivelyCompleted = item.currentCount >= item.targetCount || skippedIds.has(item.id);
    const mockItem = { ...item, currentCount: isEffectivelyCompleted ? item.targetCount : item.currentCount };
    return (
      <HabitCard
        habit={mockItem}
        onPress={() => navigateToDetails(item.id)}
        onLogCompletion={() => handleLogCompletion(item.id, item.currentCount, item.targetCount)}
        onSkip={() => handleSkip(item.id)}
      />
    );
  }, [skippedIds]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top']}>
      <View className="px-4 py-3 flex-row justify-between items-center bg-white">
        <HeadingLG>Habits</HeadingLG>
        <IconButton 
          leftIcon="Search"
          onPress={() => navigation.navigate('HabitSearch')}
          accessibilityRole="button"
          accessibilityLabel="Search habits"
        />
      </View>

      <FlatList
        data={sortedHabits}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={false} // Disabled to prevent LayoutAnimation clipping issues
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#CBD5E1" />
        }
      />

      <FloatingActionButton
        leftIcon="Plus"
        onPress={() => navigateToEditor()}
        accessibilityRole="button"
        accessibilityLabel="Create Habit"
        testID="add_habit_button"
      />
    </SafeAreaView>
  );
};
