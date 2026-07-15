import React from 'react';
import { View } from 'react-native';
import { HeadingLG, Caption, PrimaryCard, Icon } from '../../../design-system';
import type { GoalStatsDTO } from '../api/goals.types';

interface GoalStatisticsCardProps {
  stats: GoalStatsDTO | undefined;
  isLoading?: boolean;
}

export const GoalStatisticsCard = ({ stats, isLoading }: GoalStatisticsCardProps) => {
  if (isLoading || !stats) {
    return (
      <PrimaryCard className="p-4 mb-6">
        <View className="animate-pulse flex-row flex-wrap justify-between">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-[48%] mb-4">
              <View className="h-4 w-16 bg-slate-200 rounded mb-2" />
              <View className="h-6 w-10 bg-slate-200 rounded" />
            </View>
          ))}
        </View>
      </PrimaryCard>
    );
  }

  const statItems = [
    { label: 'Active Goals', value: stats.active, icon: <Icon name="Target" size={16} color="#6366F1" /> },
    { label: 'Completed', value: stats.completed, icon: <Icon name="CheckCircle2" size={16} color="#10B981" /> },
    { label: 'Avg Progress', value: `${Math.round(stats.average_progress)}%`, icon: <Icon name="Zap" size={16} color="#F59E0B" /> },
    { label: 'Completion Rate', value: `${Math.round(stats.completion_rate)}%`, icon: <Icon name="Trophy" size={16} color="#EC4899" /> },
  ];

  return (
    <PrimaryCard className="p-4 mb-6 bg-indigo-50 border-indigo-100">
      <View className="flex-row flex-wrap justify-between">
        {statItems.map((item, index) => (
          <View key={index} className="w-[48%] mb-4">
            <View className="flex-row items-center mb-1">
              {item.icon}
              <Caption className="text-slate-600 ml-1 font-medium">
                {item.label}
              </Caption>
            </View>
            <HeadingLG className="text-text-light dark:text-text-dark mt-1">
              {item.value}
            </HeadingLG>
          </View>
        ))}
      </View>
    </PrimaryCard>
  );
};
