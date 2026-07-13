import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Flame, CheckCircle2 } from 'lucide-react-native';
import type { HabitStatsModel } from '../api/habits.types';

interface HabitStatisticsCardProps {
  stats: HabitStatsModel;
}

export const HabitStatisticsCard: React.FC<HabitStatisticsCardProps> = ({ stats }) => {
  return (
    <Card className="mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Typography variant="h3">Progress</Typography>
        <Typography variant="caption" className="text-gray-500">
          {stats.completionRate.toFixed(0)}% Completion
        </Typography>
      </View>
      
      <View className="flex-row justify-between">
        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mb-2">
            <CheckCircle2 color="#10B981" size={20} />
          </View>
          <Typography variant="h3">{stats.completedToday} / {stats.totalHabits}</Typography>
          <Typography variant="caption" className="text-gray-500 text-center">Today</Typography>
        </View>

        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mb-2">
            <Flame color="#F97316" size={20} />
          </View>
          <Typography variant="h3">{stats.longestActiveStreak}</Typography>
          <Typography variant="caption" className="text-gray-500 text-center">Best Streak</Typography>
        </View>
      </View>
    </Card>
  );
};
