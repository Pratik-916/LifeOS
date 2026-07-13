import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top']}>
      <View className="px-4 py-3 bg-white border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3" accessibilityRole="button">
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search habits..."
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={debouncedQuery ? (habitsData?.results || []) : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onPress={() => navigation.navigate('HabitDetails', { habitId: item.id })}
            onLogCompletion={() => handleLogCompletion(item.id, item.currentCount, item.targetCount)}
            onArchive={() => archiveHabit.mutate(item.id)}
          />
        )}
        ListEmptyComponent={() => {
          if (!debouncedQuery) return null;
          if (isLoading) {
            return <View><HabitSkeleton /><HabitSkeleton /></View>;
          }
          return <EmptyHabitsState isSearch />;
        }}
      />
    </SafeAreaView>
  );
};
