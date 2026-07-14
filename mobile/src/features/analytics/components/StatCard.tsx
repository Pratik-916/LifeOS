import React from 'react';
import { View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, iconColor, trend, trendValue }: StatCardProps) => {
  return (
    <Card className="flex-1 m-1 p-3">
      <View className="flex-row justify-between items-start mb-2">
        <Typography variant="caption" className="text-gray-500 font-medium">
          {title}
        </Typography>
        {Icon && <Icon size={16} color={iconColor || "#9CA3AF"} />}
      </View>
      <View className="flex-row items-end">
        <Typography variant="h2" className="text-gray-900">
          {value}
        </Typography>
        {trend && trendValue && (
          <Typography 
            variant="caption" 
            className={`ml-2 mb-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'} {trendValue}
          </Typography>
        )}
      </View>
      {subtitle && (
        <Typography variant="caption" className="text-gray-400 mt-1">
          {subtitle}
        </Typography>
      )}
    </Card>
  );
};
