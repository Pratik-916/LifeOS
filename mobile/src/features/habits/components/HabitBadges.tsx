import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';
import { Bell, BellOff, Calendar, CalendarDays } from 'lucide-react-native';

export const CategoryChip: React.FC<{ category: string }> = ({ category }) => (
  <View className="bg-blue-50 px-2 py-1 rounded-md mr-2 mb-2">
    <Typography variant="caption" className="text-blue-700 font-medium">
      {category || 'General'}
    </Typography>
  </View>
);

export const FrequencyBadge: React.FC<{ frequency: 'daily' | 'weekly' }> = ({ frequency }) => (
  <View className={`flex-row items-center px-2 py-1 rounded-md mr-2 mb-2 ${frequency === 'daily' ? 'bg-orange-50' : 'bg-purple-50'}`}>
    {frequency === 'daily' ? (
      <Calendar size={12} color="#EA580C" className="mr-1" />
    ) : (
      <CalendarDays size={12} color="#9333EA" className="mr-1" />
    )}
    <Typography variant="caption" className={`font-medium ${frequency === 'daily' ? 'text-orange-600' : 'text-purple-600'}`}>
      {frequency === 'daily' ? 'Daily' : 'Weekly'}
    </Typography>
  </View>
);

export const ReminderIndicator: React.FC<{ enabled: boolean }> = ({ enabled }) => (
  <View className="flex-row items-center mr-2 mb-2">
    {enabled ? (
      <Bell size={14} color="#10B981" />
    ) : (
      <BellOff size={14} color="#9CA3AF" />
    )}
  </View>
);
