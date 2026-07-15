import React from 'react';
import { View } from 'react-native';
import { HeadingLG } from '../../../design-system';

interface DashboardSectionTitleProps {
  title: string;
}

export const DashboardSectionTitle = React.memo(({ title }: DashboardSectionTitleProps) => {
  return (
    <View className="mb-3 px-1" accessible={true} accessibilityRole="header">
      <HeadingLG className="text-slate-800">{title}</HeadingLG>
    </View>
  );
});
DashboardSectionTitle.displayName = 'DashboardSectionTitle';
