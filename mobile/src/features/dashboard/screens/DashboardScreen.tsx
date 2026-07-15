import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../api/client';
import { monitoringService } from '../../../services/monitoring';

import { DashboardHeader } from '../components/DashboardHeader';
import { HeroProductivityCard } from '../components/HeroProductivityCard';
import { TodayOverview } from '../components/OverviewCard';
import { QuickActions } from '../components/QuickActions';
import { AgendaCard } from '../components/AgendaCard';
import { InsightCarousel } from '../components/InsightCarousel';
import { WeeklyProgressSection } from '../components/WeeklyProgressSection';
import { DashboardSkeleton } from '../components/DashboardSkeleton';

import type { DashboardSummaryDTO, DashboardSummary } from '../../analytics/api/analytics.types';
import { mapDashboardSummary } from '../../analytics/api/analytics.mapper';

export const DashboardScreen = () => {
  const { data: dashboardData, isLoading, refetch, isRefetching } = useQuery<DashboardSummary>({
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
        ) : (
          <View className="pb-20">
            {dashboardData && (
              <>
                <HeroProductivityCard 
                  score={dashboardData.productivityScore || 0}
                  trend={dashboardData.productivityScore >= (dashboardData.weeklyProductivity || 0) ? 'up' : 'down'}
                  completionPercentage={dashboardData.completionPercentage || 0}
                />
                
                <TodayOverview 
                  tasks={dashboardData.todaysTasks || 0}
                  habits={dashboardData.todaysHabits || 0}
                  goals={dashboardData.currentGoals || 0}
                  journal={dashboardData.journalEntriesThisWeek || 0}
                  journey={dashboardData.journeyEventsThisMonth || 0}
                />

                <QuickActions />

                <AgendaCard deadlines={dashboardData.upcomingDeadlines || []} />

                <InsightCarousel summary={dashboardData} />

                <WeeklyProgressSection score={dashboardData.weeklyProductivity || 0} />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
