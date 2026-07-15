import React from 'react';
import { ScrollView, View } from 'react-native';
import { useJourneyStatistics } from '../hooks/useJourneyStatistics';
import { JourneyStatisticsCard } from '../components/JourneyStatisticsCard';
import { HeadingMD, BodyMD, Card } from '../../../design-system';

export const JourneyStatisticsScreen = () => {
  const { data: stats, isLoading } = useJourneyStatistics();

  if (isLoading || !stats) {
    return <View className="flex-1 bg-background-light dark:bg-background-dark" />;
  }

  return (
    <ScrollView className="flex-1 bg-background-light dark:bg-background-dark" contentContainerStyle={{ padding: 16 }}>
      <JourneyStatisticsCard stats={stats} />
      
      <Card className="mb-4">
        <HeadingMD className="mb-3">Activity Breakdown</HeadingMD>
        <View className="flex-row justify-between border-b border-secondary-100 dark:border-secondary-900 py-2">
          <BodyMD className="text-text-muted">Completed Goals</BodyMD>
          <BodyMD className="font-semibold text-text-light dark:text-text-dark">{stats.completedGoals}</BodyMD>
        </View>
        <View className="flex-row justify-between border-b border-secondary-100 dark:border-secondary-900 py-2">
          <BodyMD className="text-text-muted">Completed Tasks</BodyMD>
          <BodyMD className="font-semibold text-text-light dark:text-text-dark">{stats.completedTasks}</BodyMD>
        </View>
        <View className="flex-row justify-between border-b border-secondary-100 dark:border-secondary-900 py-2">
          <BodyMD className="text-text-muted">Habit Milestones</BodyMD>
          <BodyMD className="font-semibold text-text-light dark:text-text-dark">{stats.habitMilestones}</BodyMD>
        </View>
        <View className="flex-row justify-between py-2">
          <BodyMD className="text-text-muted">Writing Milestones</BodyMD>
          <BodyMD className="font-semibold text-text-light dark:text-text-dark">{stats.writingMilestones}</BodyMD>
        </View>
      </Card>

      <Card className="mb-8">
        <HeadingMD className="mb-3">Highlights</HeadingMD>
        <View className="flex-row justify-between border-b border-secondary-100 dark:border-secondary-900 py-2">
          <BodyMD className="text-text-muted">Longest Habit Streak</BodyMD>
          <BodyMD className="font-semibold text-text-light dark:text-text-dark">{stats.longestHabitStreak} days</BodyMD>
        </View>
        <View className="flex-row justify-between border-b border-secondary-100 dark:border-secondary-900 py-2">
          <BodyMD className="text-text-muted">Longest Writing Streak</BodyMD>
          <BodyMD className="font-semibold text-text-light dark:text-text-dark">{stats.longestWritingStreak} days</BodyMD>
        </View>
        <View className="flex-row justify-between border-b border-secondary-100 dark:border-secondary-900 py-2">
          <BodyMD className="text-text-muted">Most Active Month</BodyMD>
          <BodyMD className="font-semibold text-text-light dark:text-text-dark">{stats.mostActiveMonth || 'N/A'}</BodyMD>
        </View>
        <View className="flex-row justify-between py-2">
          <BodyMD className="text-text-muted">Most Used Category</BodyMD>
          <BodyMD className="font-semibold text-text-light dark:text-text-dark">{stats.mostUsedCategory || 'N/A'}</BodyMD>
        </View>
      </Card>
    </ScrollView>
  );
};
