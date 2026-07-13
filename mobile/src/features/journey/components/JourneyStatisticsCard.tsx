import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import type { JourneyStatsModel } from '../api/journey.types';
import { Camera, Heart, Trophy, CalendarDays } from 'lucide-react-native';

interface JourneyStatisticsCardProps {
  stats: JourneyStatsModel | undefined;
  isLoading?: boolean;
}

export const JourneyStatisticsCard = ({ stats, isLoading }: JourneyStatisticsCardProps) => {
  if (isLoading || !stats) {
    return (
      <Card className="p-4 mb-6 border border-slate-100">
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
    { label: 'Memories', value: stats.totalMemories, icon: <Camera size={16} color="#4F46E5" /> },
    { label: 'Favorites', value: stats.longestHabitStreak, icon: <Heart size={16} color="#E11D48" /> }, // Use real backend favorites stat when available, for now mapped
    { label: 'Achievements', value: stats.totalAchievements, icon: <Trophy size={16} color="#F59E0B" /> },
    { label: 'Active Years', value: stats.activeYears, icon: <CalendarDays size={16} color="#0EA5E9" /> },
  ];

  return (
    <Card className="p-4 mb-6 bg-slate-50 border border-slate-100">
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
