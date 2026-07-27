import React from 'react';
import { View, ScrollView, RefreshControl, Text, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../api/client';
import { monitoringService } from '../../../services/monitoring';
import { DashboardHeader } from '../components/DashboardHeader';

import { HeroProductivityCard } from '../components/HeroProductivityCard';
import { TodayOverview } from '../components/OverviewCard';
import { AgendaCard } from '../components/AgendaCard';
// Removed: QuickActions, InsightCarousel, WeeklyProgressSection
import { DashboardSkeleton } from '../components/DashboardSkeleton';

import type { DashboardSummaryDTO, DashboardSummary } from '../../analytics/api/analytics.types';
import { mapDashboardSummary } from '../../analytics/api/analytics.mapper';

export const DashboardScreen = () => {
  const { data: dashboardData, isLoading, isError, refetch, isRefetching } = useQuery<DashboardSummary>({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get<DashboardSummaryDTO>('/api/v1/analytics/dashboard/');
      return mapDashboardSummary(response.data);
    }
  });

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

  return (
    <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
      <ScrollView 
        className="flex-1 pt-6 px-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader firstName={userData?.first_name} />

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
                <HeroProductivityCard 
                  score={dashboardData.productivityScore || 0}
                  trend={dashboardData.productivityScore >= (dashboardData.weeklyProductivity || 0) ? 'up' : 'down'}
                  completionPercentage={dashboardData.completionPercentage || 0}
                />
                
                <AgendaCard deadlines={dashboardData.upcomingDeadlines || []} />
                
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
