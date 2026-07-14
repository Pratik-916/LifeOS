import React from 'react';
import { ScrollView, View } from 'react-native';
import { useJourneyStatistics } from '../hooks/useJourneyStatistics';
import { JourneyStatisticsCard } from '../components/JourneyStatisticsCard';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';

export const JourneyStatisticsScreen = () => {
  const { data: stats, isLoading } = useJourneyStatistics();

  if (isLoading || !stats) {
    return <View className="flex-1 bg-white" />;
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16 }}>
      <JourneyStatisticsCard stats={stats} />
      
      <Card className="mb-4">
        <Typography variant="h3" className="mb-3">Activity Breakdown</Typography>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <Typography variant="body" className="text-gray-600">Completed Goals</Typography>
          <Typography variant="body" className="font-semibold text-gray-900">{stats.completedGoals}</Typography>
        </View>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <Typography variant="body" className="text-gray-600">Completed Tasks</Typography>
          <Typography variant="body" className="font-semibold text-gray-900">{stats.completedTasks}</Typography>
        </View>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <Typography variant="body" className="text-gray-600">Habit Milestones</Typography>
          <Typography variant="body" className="font-semibold text-gray-900">{stats.habitMilestones}</Typography>
        </View>
        <View className="flex-row justify-between py-2">
          <Typography variant="body" className="text-gray-600">Writing Milestones</Typography>
          <Typography variant="body" className="font-semibold text-gray-900">{stats.writingMilestones}</Typography>
        </View>
      </Card>

      <Card className="mb-8">
        <Typography variant="h3" className="mb-3">Highlights</Typography>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <Typography variant="body" className="text-gray-600">Longest Habit Streak</Typography>
          <Typography variant="body" className="font-semibold text-gray-900">{stats.longestHabitStreak} days</Typography>
        </View>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <Typography variant="body" className="text-gray-600">Longest Writing Streak</Typography>
          <Typography variant="body" className="font-semibold text-gray-900">{stats.longestWritingStreak} days</Typography>
        </View>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <Typography variant="body" className="text-gray-600">Most Active Month</Typography>
          <Typography variant="body" className="font-semibold text-gray-900">{stats.mostActiveMonth || 'N/A'}</Typography>
        </View>
        <View className="flex-row justify-between py-2">
          <Typography variant="body" className="text-gray-600">Most Used Category</Typography>
          <Typography variant="body" className="font-semibold text-gray-900">{stats.mostUsedCategory || 'N/A'}</Typography>
        </View>
      </Card>
    </ScrollView>
  );
};
