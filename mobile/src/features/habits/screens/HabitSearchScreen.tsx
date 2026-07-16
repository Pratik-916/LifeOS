/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton, Icon } from '../../../design-system';
import { MainStackParamList } from '../../../navigation/types';
import { HabitCard } from '../components/HabitCard';
import { HabitSkeleton } from '../components/HabitSkeleton';
import { EmptyHabitsState } from '../components/EmptyHabitsState';
import { useHabits } from '../hooks/useHabits';
import { useHabitMutations } from '../hooks/useHabitMutations';
import { format } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const HabitSearchScreen = () => {
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

  // We only fetch when there is a search query
  const { data: habitsData, isLoading } = useHabits(debouncedQuery ? { search: debouncedQuery } : undefined);
  const { logHabit, archiveHabit } = useHabitMutations();

  const handleLogCompletion = (id: string, currentCount: number, targetCount: number) => {
    if (currentCount < targetCount) {
      logHabit.mutate({ 
        id, 
        payload: { completion_date: format(new Date(), 'yyyy-MM-dd'), count: 1 }
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderItem = useCallback(({ item }: any) => (
    <HabitCard
      habit={item}
      onPress={() => navigation.navigate('HabitDetails', { habitId: item.id })}
      onLogCompletion={() => handleLogCompletion(item.id, item.currentCount, item.targetCount)}
      onArchive={() => archiveHabit.mutate(item.id)}
    />
  ), []);

  const renderEmpty = useCallback(() => {
    if (!debouncedQuery) return null;
    if (isLoading) {
      return <View><HabitSkeleton /><HabitSkeleton /></View>;
    }
    return <EmptyHabitsState isSearch />;
  }, [debouncedQuery, isLoading]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }} edges={['top']}>
      <View className="px-4 py-3 bg-background-light dark:bg-background-dark border-b border-secondary-100 dark:border-secondary-900 flex-row items-center">
        <IconButton leftIcon="ArrowLeft" onPress={() => navigation.goBack()} className="mr-3" accessibilityRole="button" />
        
        <View className="flex-1 flex-row items-center bg-surface-light dark:bg-surface-dark rounded-lg px-3 py-2">
          <Icon name="Search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base text-text-light dark:text-text-dark"
            placeholder="Search habits..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Icon name="X" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={debouncedQuery ? (habitsData?.results || []) : []}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
};
