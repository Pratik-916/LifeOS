import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckSquare, Target, Trophy, BookOpen, Compass } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';
import { DashboardSectionTitle } from './DashboardSectionTitle';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

interface ActionButtonProps {
  label: string;
  color: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const ActionButton = ({ label, color, icon, onPress }: ActionButtonProps) => (
  <Pressable 
    onPress={onPress}
    className="items-center mr-6"
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={`Create new ${label}`}
  >
    <View 
      className="w-14 h-14 rounded-full items-center justify-center mb-2 shadow-sm border border-slate-100" 
      style={{ backgroundColor: color }}
    >
      {icon}
    </View>
    <Typography variant="caption" className="text-slate-700 font-medium">{label}</Typography>
  </Pressable>
);

export const QuickActions = React.memo(() => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  return (
    <View className="mb-8">
      <DashboardSectionTitle title="Quick Actions" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
        <ActionButton 
          label="Task" color="#DBEAFE" 
          icon={<CheckSquare size={24} color="#2563EB" />} 
          onPress={() => navigation.navigate('TaskEditor', {})} 
        />
        <ActionButton 
          label="Habit" color="#D1FAE5" 
          icon={<Target size={24} color="#10B981" />} 
          onPress={() => navigation.navigate('HabitEditor', {})} 
        />
        <ActionButton 
          label="Goal" color="#FEF3C7" 
          icon={<Trophy size={24} color="#F59E0B" />} 
          onPress={() => navigation.navigate('GoalEditor', {})} 
        />
        <ActionButton 
          label="Journal" color="#EDE9FE" 
          icon={<BookOpen size={24} color="#8B5CF6" />} 
          onPress={() => navigation.navigate('JournalEditor', {})} 
        />
        <ActionButton 
          label="Memory" color="#CCFBF1" 
          icon={<Compass size={24} color="#14B8A6" />} 
          onPress={() => navigation.navigate('MemoryEditor', {})} 
        />
      </ScrollView>
    </View>
  );
});
QuickActions.displayName = 'QuickActions';
