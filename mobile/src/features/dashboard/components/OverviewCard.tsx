import React from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, PrimaryCard, BodyMD, HeadingMD } from '../../../design-system';
import { DashboardSectionTitle } from './DashboardSectionTitle';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

interface OverviewCardProps {
  title: string;
  status: string;
  color: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const OverviewCard = ({ title, status, color, icon, onPress }: OverviewCardProps) => {
  return (
    <PrimaryCard 
      onPress={onPress}
      className="p-4 mr-3 w-[150px] shadow-sm border border-slate-100"
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${status}`}
    >
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-2" style={{ backgroundColor: `${color}15` }}>
          {icon}
        </View>
        <BodyMD className="font-semibold text-slate-700">{title}</BodyMD>
      </View>
      <HeadingMD className="mt-1" style={{ color }}>{status}</HeadingMD>
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
    <View className="mb-6">
      <DashboardSectionTitle title="Today's Overview" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
        <OverviewCard 
          title="Tasks" 
          status={tasks === 0 ? "Nothing planned" : `${tasks} Due Today`}
          color="#2563EB" 
          icon={<Icon name="CheckSquare" size={20} color="#2563EB" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Planner' })} 
        />
        <OverviewCard 
          title="Habits" 
          status={habits === 0 ? "All Complete" : `${habits} Remaining`}
          color="#10B981" 
          icon={<Icon name="Target" size={20} color="#10B981" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Today' })} 
        />
        <OverviewCard 
          title="Goals" 
          status={goals === 0 ? "No active goals" : `${goals} Active`}
          color="#F59E0B" 
          icon={<Icon name="Trophy" size={20} color="#F59E0B" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Today' })} 
        />
        <OverviewCard 
          title="Journal" 
          status={journal === 0 ? "No entries yet" : `${journal} This Week`}
          color="#8B5CF6" 
          icon={<Icon name="BookOpen" size={20} color="#8B5CF6" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Journal' })} 
        />
        <OverviewCard 
          title="Journey" 
          status={journey === 0 ? "Ready to reflect" : `${journey} Memories`}
          color="#14B8A6" 
          icon={<Icon name="Compass" size={20} color="#14B8A6" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Today' })} 
        />
      </ScrollView>
    </View>
  );
});
TodayOverview.displayName = 'TodayOverview';
