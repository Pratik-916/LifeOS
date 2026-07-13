import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import type { GoalStatsDTO } from '../api/goals.types';
import { Target, CheckCircle2, Zap, Trophy } from 'lucide-react-native';

interface GoalStatisticsCardProps {
  stats: GoalStatsDTO | undefined;
  isLoading?: boolean;
}

export const GoalStatisticsCard = ({ stats, isLoading }: GoalStatisticsCardProps) => {
  if (isLoading || !stats) {
    return (
      <Card className="p-4 mb-6">
        <View className="animate-pulse flex-row flex-wrap justify-between">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-[48%] mb-4">
              <View className="h-4 w-16 bg-slate-200 rounded mb-2" />
              <View className="h-6 w-10 bg-slate-200 rounded" />
            </View>
          ))}
        </View>
      </Card>
    );
  }

  const statItems = [
    { label: 'Active Goals', value: stats.active, icon: <Target size={16} color="#6366F1" /> },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle2 size={16} color="#10B981" /> },
    { label: 'Avg Progress', value: `${Math.round(stats.average_progress)}%`, icon: <Zap size={16} color="#F59E0B" /> },
    { label: 'Completion Rate', value: `${Math.round(stats.completion_rate)}%`, icon: <Trophy size={16} color="#EC4899" /> },
  ];

  return (
    <Card className="p-4 mb-6 bg-indigo-50 border-indigo-100">
      <View className="flex-row flex-wrap justify-between">
        {statItems.map((item, index) => (
          <View key={index} className="w-[48%] mb-4">
            <View className="flex-row items-center mb-1">
              {item.icon}
              <Typography variant="caption" className="text-slate-600 ml-1 font-medium">
                {item.label}
              </Typography>
            </View>
            <Typography variant="h2" className="text-slate-900 mt-1">
              {item.value}
            </Typography>
          </View>
        ))}
      </View>
    </Card>
  );
};
