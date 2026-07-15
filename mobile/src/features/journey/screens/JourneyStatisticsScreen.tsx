import React from 'react';
import { ScrollView, View } from 'react-native';
import { useJourneyStatistics } from '../hooks/useJourneyStatistics';
import { JourneyStatisticsCard } from '../components/JourneyStatisticsCard';
import { HeadingMD, BodyMD, Card } from '../../../design-system';

export const JourneyStatisticsScreen = () => {
  const { data: stats, isLoading } = useJourneyStatistics();

  if (isLoading || !stats) {
    return <View className="flex-1 bg-white" />;
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16 }}>
      <JourneyStatisticsCard stats={stats} />
      
      <Card className="mb-4">
        <HeadingMD className="mb-3">Activity Breakdown</HeadingMD>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <BodyMD className="text-gray-600">Completed Goals</BodyMD>
          <BodyMD className="font-semibold text-gray-900">{stats.completedGoals}</BodyMD>
        </View>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <BodyMD className="text-gray-600">Completed Tasks</BodyMD>
          <BodyMD className="font-semibold text-gray-900">{stats.completedTasks}</BodyMD>
        </View>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <BodyMD className="text-gray-600">Habit Milestones</BodyMD>
          <BodyMD className="font-semibold text-gray-900">{stats.habitMilestones}</BodyMD>
        </View>
        <View className="flex-row justify-between py-2">
          <BodyMD className="text-gray-600">Writing Milestones</BodyMD>
          <BodyMD className="font-semibold text-gray-900">{stats.writingMilestones}</BodyMD>
        </View>
      </Card>

      <Card className="mb-8">
        <HeadingMD className="mb-3">Highlights</HeadingMD>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <BodyMD className="text-gray-600">Longest Habit Streak</BodyMD>
          <BodyMD className="font-semibold text-gray-900">{stats.longestHabitStreak} days</BodyMD>
        </View>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <BodyMD className="text-gray-600">Longest Writing Streak</BodyMD>
          <BodyMD className="font-semibold text-gray-900">{stats.longestWritingStreak} days</BodyMD>
        </View>
        <View className="flex-row justify-between border-b border-gray-100 py-2">
          <BodyMD className="text-gray-600">Most Active Month</BodyMD>
          <BodyMD className="font-semibold text-gray-900">{stats.mostActiveMonth || 'N/A'}</BodyMD>
        </View>
        <View className="flex-row justify-between py-2">
          <BodyMD className="text-gray-600">Most Used Category</BodyMD>
          <BodyMD className="font-semibold text-gray-900">{stats.mostUsedCategory || 'N/A'}</BodyMD>
        </View>
      </Card>
    </ScrollView>
  );
};
