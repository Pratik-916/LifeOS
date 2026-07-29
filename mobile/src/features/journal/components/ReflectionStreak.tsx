import React from 'react';
import { View } from 'react-native';
import { BodyMD } from '../../../design-system';
import { useJournalStats } from '../hooks/useJournalStats';

export const ReflectionStreak = () => {
  const { data: stats } = useJournalStats();

  if (!stats || stats.currentStreak <= 1) {
    return null;
  }

  return (
    <View className="mb-6 px-2">
      <BodyMD className="text-slate-500 italic">
        You've reflected for {stats.currentStreak} evenings in a row.
      </BodyMD>
    </View>
  );
};
