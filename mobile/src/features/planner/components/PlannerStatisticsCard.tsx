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
        <Caption className="text-gray-500">
          {stats.completionRate}% Completion
        </Caption>
      </View>
      
      <View className="flex-row justify-between">
        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-2">
            <Clock color="#3B82F6" size={20} />
          </View>
          <HeadingMD>{stats.pending}</HeadingMD>
          <Caption className="text-gray-500 text-center">Pending</Caption>
        </View>

        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mb-2">
            <CheckCircle2 color="#10B981" size={20} />
          </View>
          <HeadingMD>{stats.completed}</HeadingMD>
          <Caption className="text-gray-500 text-center">Completed</Caption>
        </View>

        <View className="items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-red-50 items-center justify-center mb-2">
            <AlertCircle color="#EF4444" size={20} />
          </View>
          <HeadingMD>{stats.overdue}</HeadingMD>
          <Caption className="text-gray-500 text-center">Overdue</Caption>
        </View>
      </View>
    </Card>
  );
};
