import React from 'react';
import { View } from 'react-native';
import { Icon, HeadingMD, BodyMD } from '../../../design-system';

interface DashboardEmptyStateProps {
  title: string;
  description: string;
}

export const DashboardEmptyState = ({ title, description }: DashboardEmptyStateProps) => {
  return (
    <View className="items-center justify-center py-10 px-6 bg-slate-50 rounded-[24px] border border-slate-100 border-dashed">
      <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-4 shadow-sm">
        <Icon name="Smile" size={32} color="#94A3B8" />
      </View>
      <HeadingMD className="text-slate-800 text-center mb-2">{title}</HeadingMD>
      <BodyMD className="text-slate-500 text-center leading-6">{description}</BodyMD>
    </View>
  );
};
