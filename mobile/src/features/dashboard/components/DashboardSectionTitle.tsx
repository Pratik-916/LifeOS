import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/ui/Typography';

interface DashboardSectionTitleProps {
  title: string;
}

export const DashboardSectionTitle = React.memo(({ title }: DashboardSectionTitleProps) => {
  return (
    <View className="mb-3 px-1" accessible={true} accessibilityRole="header">
      <Typography variant="h3" className="text-slate-800">{title}</Typography>
    </View>
  );
});
DashboardSectionTitle.displayName = 'DashboardSectionTitle';
