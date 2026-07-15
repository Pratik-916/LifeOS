import React from 'react';
import { View } from 'react-native';
import { HeadingLG } from '../../../design-system';

export const TimelineHeader = ({ year }: { year: string }) => {
  return (
    <View className="bg-gray-50 py-3 px-4 border-b border-gray-200">
      <HeadingLG className="text-gray-900">{year}</HeadingLG>
    </View>
  );
};
