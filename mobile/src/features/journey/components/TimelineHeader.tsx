import React from 'react';
import { View } from 'react-native';
import { HeadingLG } from '../../../design-system';

export const TimelineHeader = ({ year }: { year: string }) => {
  return (
    <View className="bg-surface-light dark:bg-surface-dark py-3 px-4 border-b border-secondary-100 dark:border-secondary-900">
      <HeadingLG className="text-text-light dark:text-text-dark">{year}</HeadingLG>
    </View>
  );
};
