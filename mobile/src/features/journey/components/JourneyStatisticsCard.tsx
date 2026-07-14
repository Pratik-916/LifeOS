import React from 'react';
import { View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import type { JourneyStatistics } from '../api/journey.types';

export const JourneyStatisticsCard = ({ stats }: { stats: JourneyStatistics }) => {
  return (
    <Card className="mb-4">
      <Typography variant="h3" className="mb-3">Overview</Typography>
      <View className="flex-row flex-wrap justify-between">
        <View className="w-[48%] bg-gray-50 p-3 rounded-xl mb-2 items-center">
          <Typography variant="h2" className="text-blue-600">{stats.totalMemories}</Typography>
          <Typography variant="caption" className="mt-1">Memories</Typography>
        </View>
        <View className="w-[48%] bg-gray-50 p-3 rounded-xl mb-2 items-center">
          <Typography variant="h2" className="text-green-600">{stats.totalTimelineEvents}</Typography>
          <Typography variant="caption" className="mt-1">Total Events</Typography>
        </View>
        <View className="w-[48%] bg-gray-50 p-3 rounded-xl mb-2 items-center">
          <Typography variant="h2" className="text-purple-600">{stats.favoriteMemories}</Typography>
          <Typography variant="caption" className="mt-1">Favorites</Typography>
        </View>
        <View className="w-[48%] bg-gray-50 p-3 rounded-xl mb-2 items-center">
          <Typography variant="h2" className="text-orange-600">{stats.activeYears}</Typography>
          <Typography variant="caption" className="mt-1">Active Years</Typography>
        </View>
      </View>
    </Card>
  );
};
