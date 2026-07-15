import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View } from 'react-native';
import { Card, HeadingMD, Caption, Icon } from '../../../design-system';
import type { JournalStatsModel } from '../api/journal.types';

interface JournalStatisticsCardProps {
  stats: JournalStatsModel;
}

export const JournalStatisticsCard = ({ stats }: JournalStatisticsCardProps) => {
  const { theme } = useTheme();

  return (
    <Card className="m-4 p-4 bg-slate-900 border-0">
      <HeadingMD className="text-white mb-4">
        Writing Journey
      </HeadingMD>
      
      <View className="flex-row justify-between">
        <View className="flex-1 items-center border-r border-slate-700">
          <Icon name="Flame" size={20} color={theme.colors.warning} className="mb-1" />
          <HeadingMD className="text-white">{stats.currentStreak}</HeadingMD>
          <Caption className="text-slate-400">Day Streak</Caption>
        </View>
        
        <View className="flex-1 items-center border-r border-slate-700">
          <Icon name="PenTool" size={20} color="#60A5FA" className="mb-1" />
          <HeadingMD className="text-white">{stats.totalEntries}</HeadingMD>
          <Caption className="text-slate-400">Total Entries</Caption>
        </View>
        
        <View className="flex-1 items-center">
          <Icon name="Clock" size={20} color={theme.colors.success} className="mb-1" />
          <HeadingMD className="text-white">{Math.round(stats.totalReadingTime / 60) || 0}m</HeadingMD>
          <Caption className="text-slate-400">Read Time</Caption>
        </View>
      </View>
    </Card>
  );
};
