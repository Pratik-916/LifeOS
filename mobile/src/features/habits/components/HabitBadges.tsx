import React from 'react';
import { View } from 'react-native';
import { CategoryChip as DSCategoryChip, Badge, Icon } from '../../../design-system';

export const CategoryChip: React.FC<{ category: string }> = ({ category }) => (
  <DSCategoryChip label={category || 'General'} className="mr-2 mb-2" />
);

export const FrequencyBadge: React.FC<{ frequency: 'daily' | 'weekly' }> = ({ frequency }) => (
  <Badge 
    label={frequency === 'daily' ? 'Daily' : 'Weekly'}
    icon={frequency === 'daily' ? 'Calendar' : 'CalendarDays'}
    colorType={frequency === 'daily' ? 'warning' : 'primary'}
    className="mr-2 mb-2"
  />
);

export const ReminderIndicator: React.FC<{ enabled: boolean }> = ({ enabled }) => (
  <View className="flex-row items-center mr-2 mb-2">
    <Icon name={enabled ? "Bell" : "BellOff"} size={14} color={enabled ? "#10B981" : "#9CA3AF"} />
  </View>
);
