import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';

export const YearHeader = ({ year }: { year: string }) => {
  return (
    <View className="py-4 mt-2">
      <Typography variant="h1" className="text-3xl text-slate-900 font-extrabold tracking-tight">
        {year}
      </Typography>
    </View>
  );
};

export const MonthHeader = ({ month }: { month: string }) => {
  return (
    <View className="py-3 flex-row items-center">
      <Typography variant="h3" className="text-indigo-600 font-bold uppercase tracking-widest mr-4">
        {month}
      </Typography>
      <View className="flex-1 h-px bg-slate-200" />
    </View>
  );
};
