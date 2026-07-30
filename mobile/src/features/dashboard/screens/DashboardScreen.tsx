import React from 'react';
import { View, ScrollView, RefreshControl, Text, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../navigation/types';
import { apiClient } from '../../../api/client';
import { monitoringService } from '../../../services/monitoring';
import { useGoals } from '../../goals/hooks/useGoals';
import { DashboardHero } from '../components/DashboardHero';
import { TodayOverview } from '../components/OverviewCard';
import { AgendaCard } from '../components/AgendaCard';
import { WeeklyInsightsSection } from '../components/WeeklyInsightsSection';
import { DashboardSkeleton } from '../components/DashboardSkeleton';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  // Mocking dashboard summary for now since analytics is removed
  // In a real app this would be a specialized endpoint or derived from useTasks/useHabits
  const dashboardData = {
    pendingTasks: 3,
    completedTasks: 5,
    overdueTasks: 1,
    productivityScore: 85,
    upcomingDeadlines: [],
    todaysTasks: 8,
    todaysHabits: 3,
    currentGoals: 2,
    journalEntriesThisWeek: 4,
    journeyEventsThisMonth: 1
  };
  const isLoading = false;
  const isError = false;
  const isRefetching = false;
  const refetch = () => {};

  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/users/me/');
      if (response.data && response.data.id) {
        monitoringService.setUser(String(response.data.id), undefined, response.data.username);
      }
      return response.data;
    }
  });

  const { data: goalsData } = useGoals({ status: 'in_progress', page_size: 1, sort_by: 'priority' });
  const primaryGoal = goalsData?.results?.[0];

  return (
    <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
      <ScrollView 
        className="flex-1 pt-6 px-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !dashboardData ? (
          <DashboardSkeleton />
        ) : isError && !dashboardData ? (
          <View className="items-center justify-center py-20">
            <Text className="text-red-500 font-medium text-center mb-4">Something didn't go as expected.</Text>
            <Pressable onPress={() => refetch()} className="bg-indigo-600 px-6 py-2 rounded-full">
              <Text className="text-white font-medium">Retry</Text>
            </Pressable>
          </View>
        ) : (
          <View className="pb-24">
            {dashboardData && (
              <>
                <DashboardHero 
                  firstName={userData?.first_name}
                  pendingTasks={dashboardData.pendingTasks || 0}
                  completedTasks={dashboardData.completedTasks || 0}
                  overdueTasks={dashboardData.overdueTasks || 0}
                  productivityScore={dashboardData.productivityScore || 0}
                  primaryGoalTitle={primaryGoal?.title}
                  onPrimaryGoalPress={() => primaryGoal?.id && navigation.navigate('GoalDetails', { id: primaryGoal.id })}
                />
                
                <AgendaCard 
                  deadlines={dashboardData.upcomingDeadlines || []} 
                  completedTasks={dashboardData.completedTasks || 0}
                  pendingTasks={dashboardData.pendingTasks || 0}
                />
                
                <WeeklyInsightsSection />
                
                <TodayOverview 
                  tasks={dashboardData.todaysTasks || 0}
                  habits={dashboardData.todaysHabits || 0}
                  goals={dashboardData.currentGoals || 0}
                  journal={dashboardData.journalEntriesThisWeek || 0}
                  journey={dashboardData.journeyEventsThisMonth || 0}
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
