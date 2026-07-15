import React from 'react';
import { View } from 'react-native';
import { HeadingMD } from '../../../design-system';

export const TimelineSection = ({ month }: { month: string }) => {
  return (
    <View className="px-4 py-2 mt-2">
      <HeadingMD className="text-gray-600 text-lg uppercase tracking-wider">{month}</HeadingMD>
    </View>
  );
};
