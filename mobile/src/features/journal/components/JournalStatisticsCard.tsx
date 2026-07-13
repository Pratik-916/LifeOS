import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { PenTool, Flame, Clock } from 'lucide-react-native';
import type { JournalStatsModel } from '../api/journal.types';

interface JournalStatisticsCardProps {
  stats: JournalStatsModel;
}

export const JournalStatisticsCard = ({ stats }: JournalStatisticsCardProps) => {
  return (
    <Card className="m-4 p-4 bg-slate-900 border-0">
      <Typography variant="h3" className="text-white mb-4">
        Writing Journey
      </Typography>
      
      <View className="flex-row justify-between">
        <View className="flex-1 items-center border-r border-slate-700">
          <Flame size={20} color="#F59E0B" className="mb-1" />
          <Typography variant="h3" className="text-white">{stats.currentStreak}</Typography>
          <Typography variant="caption" className="text-slate-400">Day Streak</Typography>
        </View>
        
        <View className="flex-1 items-center border-r border-slate-700">
          <PenTool size={20} color="#60A5FA" className="mb-1" />
          <Typography variant="h3" className="text-white">{stats.totalEntries}</Typography>
          <Typography variant="caption" className="text-slate-400">Total Entries</Typography>
        </View>
        
        <View className="flex-1 items-center">
          <Clock size={20} color="#34D399" className="mb-1" />
          <Typography variant="h3" className="text-white">{Math.round(stats.totalReadingTime / 60) || 0}m</Typography>
          <Typography variant="caption" className="text-slate-400">Read Time</Typography>
        </View>
      </View>
    </Card>
  );
};
