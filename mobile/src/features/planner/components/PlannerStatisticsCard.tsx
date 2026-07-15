import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View } from 'react-native';
import { HeadingMD, Caption, Card } from '../../../design-system';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';
import type { PlannerStats } from '../api/planner.types';

interface PlannerStatisticsCardProps {
  stats: PlannerStats;
}

export const PlannerStatisticsCard: React.FC<PlannerStatisticsCardProps> = ({ stats }) => {
  return (
    <Card className="mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <HeadingMD>Overview</HeadingMD>
        <Caption className="text-text-muted">
          {stats.completionRate}% Completion
        </Caption>
      </View>
      
      <View className="flex-row justify-between">
        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-2">
            <Clock color={theme.colors.primary[400]} size={20} />
          </View>
          <HeadingMD>{stats.pending}</HeadingMD>
          <Caption className="text-text-muted text-center">Pending</Caption>
        </View>

        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mb-2">
            <CheckCircle2 color={theme.colors.success} size={20} />
          </View>
          <HeadingMD>{stats.completed}</HeadingMD>
          <Caption className="text-text-muted text-center">Completed</Caption>
        </View>

        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mb-2">
            <AlertCircle color={theme.colors.danger} size={20} />
          </View>
          <HeadingMD>{stats.overdue}</HeadingMD>
          <Caption className="text-text-muted text-center">Overdue</Caption>
        </View>
      </View>
    </Card>
  );
};
