import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';

export const TimelineSection = ({ month }: { month: string }) => {
  return (
    <View className="px-4 py-2 mt-2">
      <Typography variant="h3" className="text-gray-600 text-lg uppercase tracking-wider">{month}</Typography>
    </View>
  );
};
