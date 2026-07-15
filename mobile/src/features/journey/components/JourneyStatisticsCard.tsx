import React from 'react';
import { View } from 'react-native';
import { Card, HeadingMD, HeadingLG, Caption } from '../../../design-system';
import type { JourneyStatistics } from '../api/journey.types';

export const JourneyStatisticsCard = ({ stats }: { stats: JourneyStatistics }) => {
  return (
    <Card className="mb-4">
      <HeadingMD className="mb-3">Overview</HeadingMD>
      <View className="flex-row flex-wrap justify-between">
        <View className="w-[48%] bg-surface-light dark:bg-surface-dark p-3 rounded-xl mb-2 items-center">
          <HeadingLG className="text-blue-600">{stats.totalMemories}</HeadingLG>
          <Caption className="mt-1">Memories</Caption>
        </View>
        <View className="w-[48%] bg-surface-light dark:bg-surface-dark p-3 rounded-xl mb-2 items-center">
          <HeadingLG className="text-green-600">{stats.totalTimelineEvents}</HeadingLG>
          <Caption className="mt-1">Total Events</Caption>
        </View>
        <View className="w-[48%] bg-surface-light dark:bg-surface-dark p-3 rounded-xl mb-2 items-center">
          <HeadingLG className="text-purple-600">{stats.favoriteMemories}</HeadingLG>
          <Caption className="mt-1">Favorites</Caption>
        </View>
        <View className="w-[48%] bg-surface-light dark:bg-surface-dark p-3 rounded-xl mb-2 items-center">
          <HeadingLG className="text-orange-600">{stats.activeYears}</HeadingLG>
          <Caption className="mt-1">Active Years</Caption>
        </View>
      </View>
    </Card>
  );
};
