import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View } from 'react-native';
import { HeadingSM, Caption, Card, Icon } from '../../../design-system';
import type { HabitStatsModel } from '../api/habits.types';

interface HabitStatisticsCardProps {
  stats: HabitStatsModel;
}

export const HabitStatisticsCard: React.FC<HabitStatisticsCardProps> = ({ stats }) => {
  return (
    <Card className="mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <HeadingSM>Progress</HeadingSM>
        <Caption className="text-text-muted">
          {stats.completionRate.toFixed(0)}% Completion
        </Caption>
      </View>
      
      <View className="flex-row justify-between">
        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mb-2">
            <Icon name="CheckCircle2" color={theme.colors.success} size={20} />
          </View>
          <HeadingSM>{stats.completedToday} / {stats.totalHabits}</HeadingSM>
          <Caption className="text-text-muted text-center">Today</Caption>
        </View>

        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center mb-2">
            <Icon name="Flame" color={theme.colors.orange[500]} size={20} />
          </View>
          <HeadingSM>{stats.longestActiveStreak}</HeadingSM>
          <Caption className="text-text-muted text-center">Best Streak</Caption>
        </View>
      </View>
    </Card>
  );
};
