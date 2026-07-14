import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckSquare, Target, Trophy, BookOpen, Compass } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';
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
    <Pressable 
      onPress={onPress}
      className="bg-white border border-slate-100 rounded-[20px] p-4 mr-3 w-[140px] shadow-sm"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${count} ${title}. ${subtitle}`}
    >
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-2" style={{ backgroundColor: `${color}15` }}>
          {icon}
        </View>
        <Typography variant="body" className="font-semibold text-slate-700">{title}</Typography>
      </View>
      <Typography variant="h1" className="text-4xl mb-1" style={{ color }}>{count}</Typography>
      <Typography variant="caption" className="text-slate-500 font-medium">{subtitle}</Typography>
    </Pressable>
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
          icon={<CheckSquare size={20} color="#2563EB" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Planner' })} 
        />
        <OverviewCard 
          title="Habits" count={habits} subtitle="To Complete" color="#10B981" 
          icon={<Target size={20} color="#10B981" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Habits' })} 
        />
        <OverviewCard 
          title="Goals" count={goals} subtitle="Active" color="#F59E0B" 
          icon={<Trophy size={20} color="#F59E0B" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Goals' })} 
        />
        <OverviewCard 
          title="Journal" count={journal} subtitle="Entries This Week" color="#8B5CF6" 
          icon={<BookOpen size={20} color="#8B5CF6" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Journal' })} 
        />
        <OverviewCard 
          title="Journey" count={journey} subtitle="Memories" color="#14B8A6" 
          icon={<Compass size={20} color="#14B8A6" />} 
          onPress={() => navigation.navigate('Tabs', { screen: 'Journey' })} 
        />
      </ScrollView>
    </View>
  );
});
TodayOverview.displayName = 'TodayOverview';
