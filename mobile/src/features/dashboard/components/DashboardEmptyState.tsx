import React from 'react';
import { View } from 'react-native';
import { Smile } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';

interface DashboardEmptyStateProps {
  title: string;
  description: string;
}

export const DashboardEmptyState = ({ title, description }: DashboardEmptyStateProps) => {
  return (
    <View className="items-center justify-center py-10 px-6 bg-slate-50 rounded-[24px] border border-slate-100 border-dashed">
      <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-4 shadow-sm">
        <Smile size={32} color="#94A3B8" />
      </View>
      <Typography variant="h3" className="text-slate-800 text-center mb-2">{title}</Typography>
      <Typography variant="body" className="text-slate-500 text-center leading-6">{description}</Typography>
    </View>
  );
};
