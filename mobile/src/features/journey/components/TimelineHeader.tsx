import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';

export const TimelineHeader = ({ year }: { year: string }) => {
  return (
    <View className="bg-gray-50 py-3 px-4 border-b border-gray-200">
      <Typography variant="h2" className="text-gray-900">{year}</Typography>
    </View>
  );
};
