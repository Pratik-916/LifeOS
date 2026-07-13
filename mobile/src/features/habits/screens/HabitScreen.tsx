import React, { useState } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Search, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../../navigation/types';
import { Typography } from '../../../components/ui/Typography';
import { HabitStatisticsCard } from '../components/HabitStatisticsCard';
import { HabitCard } from '../components/HabitCard';
import { HabitSkeleton } from '../components/HabitSkeleton';
import { EmptyHabitsState } from '../components/EmptyHabitsState';
import { useHabits } from '../hooks/useHabits';
import { useHabitStats } from '../hooks/useHabitStats';
import { useHabitMutations } from '../hooks/useHabitMutations';
import { useTheme } from '../../../theme/ThemeProvider';
import { format } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const HabitScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
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

  const renderHeader = () => (
    <View className="mb-4">
      {statsData && <HabitStatisticsCard stats={statsData} />}
      <Typography variant="h3" className="mb-2 mt-4">Today's Habits</Typography>
    </View>
  );

  const renderEmpty = () => {
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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top']}>
      <View className="px-4 py-3 flex-row justify-between items-center bg-white border-b border-gray-200">
        <Typography variant="h2">Habits</Typography>
        <TouchableOpacity 
          onPress={() => navigation.navigate('HabitSearch')}
          accessibilityRole="button"
          accessibilityLabel="Search habits"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Search color={theme.colors.text.DEFAULT} size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={habitsData?.results || []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onPress={() => navigateToDetails(item.id)}
            onLogCompletion={() => handleLogCompletion(item.id, item.currentCount, item.targetCount)}
            onArchive={() => handleArchive(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: theme.colors.primary.DEFAULT,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        onPress={() => navigateToEditor()}
        accessibilityRole="button"
        accessibilityLabel="Create Habit"
      >
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
