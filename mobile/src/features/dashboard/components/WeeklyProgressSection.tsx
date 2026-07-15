import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, PrimaryCard, HeadingMD, Caption, SecondaryButton } from '../../../design-system';
import { DashboardSectionTitle } from './DashboardSectionTitle';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

interface WeeklyProgressSectionProps {
  score: number;
}

export const WeeklyProgressSection = React.memo(({ score }: WeeklyProgressSectionProps) => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  return (
    <View className="mb-8">
      <DashboardSectionTitle title="Weekly Progress" />
      <PrimaryCard className="p-5 shadow-sm border border-slate-100">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
            <Icon name="TrendingUp" size={24} color={theme.colors.primary[500]} />
          </View>
          <View className="flex-1">
            <HeadingMD className="text-text-light dark:text-text-dark">Steady Growth</HeadingMD>
            <Caption className="text-slate-500">Your average score is {score} this week.</Caption>
          </View>
        </View>

        <View className="h-32 bg-slate-50 rounded-xl mb-4 items-center justify-center border border-slate-100 border-dashed">
            <Icon name="BarChart2" size={32} color={theme.colors.border} className="mb-2" />
            <Caption className="text-slate-400">Detailed analytics chart available inside</Caption>
        </View>

        <SecondaryButton 
          title="View Full Analytics" 
          onPress={() => navigation.navigate('AnalyticsDashboard')}
        />
      </PrimaryCard>
    </View>
  );
});
WeeklyProgressSection.displayName = 'WeeklyProgressSection';
