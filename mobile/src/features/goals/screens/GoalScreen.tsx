import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MainStackParamList } from '../../../navigation/types';
import { useGoals } from '../hooks/useGoals';
import { useGoalMutations } from '../hooks/useGoalMutations';
import { useGoalStatistics } from '../hooks/useGoalStatistics';
import { GoalCard } from '../components/GoalCard';
import { GoalSkeleton } from '../components/GoalSkeleton';
import { GoalEmptyState } from '../components/GoalEmptyState';
import { GoalStatisticsCard } from '../components/GoalStatisticsCard';
import { HeadingXL, Caption, IconButton, FloatingActionButton } from '../../../design-system';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const TABS = ['Active', 'Completed', 'Favorites', 'Archived'];

export const GoalScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState('Active');
  
  const getFilters = () => {
    switch (activeTab) {
      case 'Completed': return { status: 'completed' };
      case 'Favorites': return { is_favorite: true };
      case 'Archived': return { is_archived: true };
      default: return { status: 'not_started,in_progress' };
    }
  };

  const { data: paginatedData, isLoading, refetch, isRefetching } = useGoals(getFilters());
  const { data: statsData, isLoading: statsLoading } = useGoalStatistics();
  const { favoriteGoal, deleteGoal, archiveGoal } = useGoalMutations();

  const goals = paginatedData?.results || [];

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-4 pt-4 pb-2 flex-row justify-between items-center">
        <HeadingXL className="text-2xl text-slate-900">Goals</HeadingXL>
        <IconButton 
          onPress={() => navigation.navigate('GoalSearch')}
          className="w-10 h-10 bg-slate-50 rounded-full"
          leftIcon="Search"
        />
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-4">
            <GoalStatisticsCard stats={statsData} isLoading={statsLoading} />
            
            <View className="flex-row mb-4 bg-slate-50 p-1 rounded-xl">
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-2 items-center rounded-lg ${activeTab === tab ? 'bg-white shadow-sm' : ''}`}
                >
                  <Caption className={`font-medium ${activeTab === tab ? 'text-slate-900' : 'text-slate-500'}`}>
                    {tab}
                  </Caption>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <GoalCard
            goal={item}
            onPress={() => navigation.navigate('GoalDetails', { id: item.id })}
            onEdit={() => navigation.navigate('GoalEditor', { id: item.id })}
            onFavorite={() => favoriteGoal({ id: item.id, isFavorite: !item.favorite })}
            onArchive={() => archiveGoal(item.id)}
            onDelete={() => deleteGoal(item.id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor="#6366F1" />
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="px-4">
              <GoalSkeleton />
              <GoalSkeleton />
              <GoalSkeleton />
            </View>
          ) : (
            <GoalEmptyState 
              onAction={() => navigation.navigate('GoalEditor', { id: undefined })} 
              message={activeTab === 'Active' ? "Set a goal to start building your future." : `No ${activeTab.toLowerCase()} goals found.`}
            />
          )
        }
      />

      <FloatingActionButton
        className="absolute bottom-6 right-6"
        onPress={() => navigation.navigate('GoalEditor', { id: undefined })}
        leftIcon="Plus"
      />
    </SafeAreaView>
  );
};
