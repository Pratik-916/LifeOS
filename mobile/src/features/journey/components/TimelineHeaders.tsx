import React from 'react';
import { View } from 'react-native';
import { HeadingXL, HeadingMD } from '../../../design-system';

export const YearHeader = ({ year }: { year: string }) => {
  return (
    <View className="py-4 mt-2">
      <HeadingXL className="text-3xl text-text-light dark:text-text-dark font-extrabold tracking-tight">
        {year}
      </HeadingXL>
    </View>
  );
};

export const MonthHeader = ({ month }: { month: string }) => {
  return (
    <View className="py-3 flex-row items-center">
      <HeadingMD className="text-indigo-600 font-bold uppercase tracking-widest mr-4">
        {month}
      </HeadingMD>
      <View className="flex-1 h-px bg-slate-200" />
    </View>
  );
};
