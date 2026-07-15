/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { HeadingLG, HeadingSM, IconButton, FloatingActionButton } from '../../../design-system';
import { HabitStatisticsCard } from '../components/HabitStatisticsCard';
import { HabitCard } from '../components/HabitCard';
import { HabitSkeleton } from '../components/HabitSkeleton';
import { EmptyHabitsState } from '../components/EmptyHabitsState';
import { useHabits } from '../hooks/useHabits';
import { useHabitStats } from '../hooks/useHabitStats';
import { useHabitMutations } from '../hooks/useHabitMutations';
import { format } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const HabitScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: habitsData, isLoading, refetch } = useHabits({ status: 'active' });
  const { data: statsData, refetch: refetchStats } = useHabitStats();
  const { logHabit, archiveHabit } = useHabitMutations();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetch(), refetchStats()]);
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
      logHabit.mutate({ 
        id, 
        payload: { completion_date: format(new Date(), 'yyyy-MM-dd'), count: 1 }
      });
    }
  };

  const handleArchive = (id: string) => {
    archiveHabit.mutate(id);
  };

  const renderHeader = useCallback(() => (
    <View className="mb-4">
      {statsData && <HabitStatisticsCard stats={statsData} />}
      <HeadingSM className="mb-2 mt-4">Today's Habits</HeadingSM>
    </View>
  ), [statsData]);

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
  }, [isLoading]); // we omit navigateToEditor since we can just ignore it or add it if we want

  const renderItem = useCallback(({ item }: any) => (
    <HabitCard
      habit={item}
      onPress={() => navigateToDetails(item.id)}
      onLogCompletion={() => handleLogCompletion(item.id, item.currentCount, item.targetCount)}
      onArchive={() => handleArchive(item.id)}
    />
  ), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }} edges={['top']}>
      <View className="px-4 py-3 flex-row justify-between items-center bg-background-light dark:bg-background-dark border-b border-secondary-100 dark:border-secondary-900">
        <HeadingLG>Habits</HeadingLG>
        <IconButton 
          leftIcon="Search"
          onPress={() => navigation.navigate('HabitSearch')}
          accessibilityRole="button"
          accessibilityLabel="Search habits"
        />
      </View>

      <FlatList
        data={habitsData?.results || []}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />

      <FloatingActionButton
        leftIcon="Plus"
        onPress={() => navigateToEditor()}
        accessibilityRole="button"
        accessibilityLabel="Create Habit"
      />
    </SafeAreaView>
  );
};
