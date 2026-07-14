import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TrendingUp, BarChart2 } from 'lucide-react-native';
import { Card } from '../../../components/ui/Card';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
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
      <Card className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mr-4">
            <TrendingUp size={24} color="#2563EB" />
          </View>
          <View className="flex-1">
            <Typography variant="h3" className="text-slate-900">Steady Growth</Typography>
            <Typography variant="caption" className="text-slate-500">Your average score is {score} this week.</Typography>
          </View>
        </View>

        <View className="h-32 bg-slate-50 rounded-xl mb-4 items-center justify-center border border-slate-100 border-dashed">
            <BarChart2 size={32} color="#CBD5E1" className="mb-2" />
            <Typography variant="caption" className="text-slate-400">Detailed analytics chart available inside</Typography>
        </View>

        <Button 
          title="View Full Analytics" 
          onPress={() => navigation.navigate('AnalyticsDashboard')}
          variant="secondary"
        />
      </Card>
    </View>
  );
});
WeeklyProgressSection.displayName = 'WeeklyProgressSection';
