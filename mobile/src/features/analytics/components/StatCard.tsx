import React from 'react';
import { View } from 'react-native';
import { StatCard as DSStatCard, Caption, HeadingLG, Icon } from '../../../design-system';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const StatCard = ({ title, value, subtitle, icon, iconColor, trend, trendValue }: StatCardProps) => {
  return (
    <DSStatCard className="flex-1 m-1 p-3">
      <View className="flex-row justify-between items-start mb-2">
        <Caption className="text-text-muted font-medium">
          {title}
        </Caption>
        {icon && <Icon name={icon} size={16} color={iconColor || "#9CA3AF"} />}
      </View>
      <View className="flex-row items-end">
        <HeadingLG className="text-text-light dark:text-text-dark">
          {value}
        </HeadingLG>
        {trend && trendValue && (
          <Caption 
            className={`ml-2 mb-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-text-muted'}`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'} {trendValue}
          </Caption>
        )}
      </View>
      {subtitle && (
        <Caption className="text-gray-400 mt-1">
          {subtitle}
        </Caption>
      )}
    </DSStatCard>
  );
};
