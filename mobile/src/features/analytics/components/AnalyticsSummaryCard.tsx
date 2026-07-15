import React from 'react';
import { View } from 'react-native';
import { PrimaryCard, HeadingLG, BodyMD } from '../../../design-system';
import { StatCard } from './StatCard';
import { ProgressRing } from './ProgressRing';

import type { DashboardSummary } from '../api/analytics.types';

interface AnalyticsSummaryCardProps {
  summary: DashboardSummary;
}

export const AnalyticsSummaryCard = ({ summary }: AnalyticsSummaryCardProps) => {
  return (
    <View className="mb-4">
      <PrimaryCard className="mb-2 bg-blue-50 border-blue-100 border">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <HeadingLG className="text-blue-900 mb-1">Productivity Score</HeadingLG>
            <BodyMD className="text-blue-700">
              You are performing {summary.productivityScore > 80 ? 'excellently' : 'well'} this week.
            </BodyMD>
          </View>
          <ProgressRing progress={summary.productivityScore} size={80} color="#2563EB" />
        </View>
      </PrimaryCard>

      <View className="flex-row mb-2">
        <StatCard 
          title="Tasks" 
          value={summary.completedTasks} 
          subtitle={`${summary.pendingTasks} pending`}
          icon="CheckSquare"
          iconColor="#4F46E5"
        />
        <StatCard 
          title="Habits" 
          value={summary.completedHabits}
          subtitle={`${summary.currentHabitStreak} day streak`}
          icon="Zap"
          iconColor="#EAB308"
        />
      </View>
      
      <View className="flex-row">
        <StatCard 
          title="Goals" 
          value={summary.completedGoals}
          subtitle={`${summary.currentGoals} active`}
          icon="Target"
          iconColor="#10B981"
        />
        <StatCard 
          title="Journal" 
          value={summary.journalEntriesThisWeek}
          subtitle="this week"
          icon="BookOpen"
          iconColor="#8B5CF6"
        />
      </View>
    </View>
  );
};
