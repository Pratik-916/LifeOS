import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, PrimaryCard, BodyMD, HeadingXL, Caption } from '../../../design-system';
import { DashboardSectionTitle } from './DashboardSectionTitle';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

interface OverviewCardProps {
  title: string;
  count: number;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const OverviewCard = ({ title, count, subtitle, color, icon, onPress }: OverviewCardProps) => {
  return (
    <PrimaryCard 
      onPress={onPress}
      className="p-4 mr-3 w-[140px] shadow-sm border border-slate-100"
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${count} ${title}. ${subtitle}`}
    >
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-2" style={{ backgroundColor: `${color}15` }}>
          {icon}
        </View>
        <BodyMD className="font-semibold text-slate-700">{title}</BodyMD>
      </View>
      <HeadingXL className="text-4xl mb-1" style={{ color }}>{count}</HeadingXL>
      <Caption className="text-slate-500 font-medium">{subtitle}</Caption>
    </PrimaryCard>
  );
};

interface TodayOverviewProps {
  tasks: number;
  habits: number;
  goals: number;
  journal: number;
  journey: number;
}

export const TodayOverview = React.memo(({ tasks, habits, goals, journal, journey }: TodayOverviewProps) => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  return (
    <View className="mb-8">
      <DashboardSectionTitle title="Today's Overview" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
        <OverviewCard 
          title="Tasks" count={tasks} subtitle="Due Today" color="#2563EB" 
          icon={<Icon name="CheckSquare" size={20} color="#2563EB" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Planner' })} 
        />
        <OverviewCard 
          title="Habits" count={habits} subtitle="To Complete" color="#10B981" 
          icon={<Icon name="Target" size={20} color="#10B981" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Habits' })} 
        />
        <OverviewCard 
          title="Goals" count={goals} subtitle="Active" color="#F59E0B" 
          icon={<Icon name="Trophy" size={20} color="#F59E0B" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Goals' })} 
        />
        <OverviewCard 
          title="Journal" count={journal} subtitle="Entries This Week" color="#8B5CF6" 
          icon={<Icon name="BookOpen" size={20} color="#8B5CF6" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Journal' })} 
        />
        <OverviewCard 
          title="Journey" count={journey} subtitle="Memories" color="#14B8A6" 
          icon={<Icon name="Compass" size={20} color="#14B8A6" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Journey' })} 
        />
      </ScrollView>
    </View>
  );
});
TodayOverview.displayName = 'TodayOverview';
