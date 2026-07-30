import React from 'react';
import { View } from 'react-native';
import { PrimaryCard, HeadingMD, BodyMD, Icon } from '../../../design-system';

export const InsightsEmptyState = () => {
  return (
    <PrimaryCard className="p-8 items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 bg-transparent shadow-none mt-4">
      <View className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 items-center justify-center mb-6">
        <Icon name="Lightbulb" size={32} color="#94A3B8" />
      </View>
      <HeadingMD className="text-text-light dark:text-text-dark mb-3 text-center">
        Gathering Insights
      </HeadingMD>
      <BodyMD className="text-slate-500 dark:text-slate-400 text-center leading-6">
        As you complete tasks, habits, and reflections, meaningful patterns will gradually appear here.
      </BodyMD>
    </PrimaryCard>
  );
};
