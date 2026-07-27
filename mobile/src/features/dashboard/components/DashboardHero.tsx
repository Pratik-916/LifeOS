import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { HeadingXL, BodyMD, IconButton, Caption, Icon } from '../../../design-system';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

interface DashboardHeroProps {
  firstName?: string;
  pendingTasks?: number;
  completedTasks?: number;
  overdueTasks?: number;
  productivityScore?: number;
}

export const DashboardHero = React.memo(({ 
  firstName = 'User', 
  pendingTasks = 0,
  completedTasks = 0,
  overdueTasks = 0,
  productivityScore = 0
}: DashboardHeroProps) => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFocusMessage = () => {
    if (overdueTasks > 0) {
      return `Let's catch up on a few overdue tasks.`;
    }
    if (completedTasks > 0 && pendingTasks === 0) {
      return `Everything is finished. Enjoy the rest of your day.`;
    }
    if (pendingTasks > 0) {
      return `You have ${pendingTasks} task${pendingTasks > 1 ? 's' : ''} to focus on today.`;
    }
    return `Your day is clear. Take a breath.`;
  };

  return (
    <View className="mb-6 flex-row justify-between items-start" accessible={true} accessibilityRole="header">
      <View className="flex-1 pr-4">
        {/* Date */}
        <Caption className="text-slate-500 mb-1 font-semibold uppercase tracking-wider">
          {format(new Date(), 'EEEE, MMMM d')}
        </Caption>
        
        {/* Greeting */}
        <HeadingXL className="text-text-light dark:text-text-dark mb-2 leading-tight">
          {getGreeting()},{'\n'}{firstName}.
        </HeadingXL>
        
        {/* Focus Today */}
        <BodyMD className="text-slate-600 dark:text-slate-400">
          {getFocusMessage()}
        </BodyMD>
      </View>
      
      <View className="items-end">
        <IconButton 
          onPress={() => navigation.navigate('Profile')}
          className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 rounded-[20px] items-center justify-center border border-indigo-100 dark:border-slate-700 mb-4"
          accessibilityLabel="Open Profile"
          accessibilityRole="button"
          leftIcon="User"
        />
        {/* Subtle Productivity Score Pill */}
        {productivityScore > 0 && (
          <View 
            className="flex-row items-center bg-orange-50 dark:bg-orange-900/30 px-2.5 py-1.5 rounded-full border border-orange-100 dark:border-orange-900/50"
            accessible={true}
            accessibilityLabel="Productivity Score"
          >
            <Icon name="Flame" size={12} color="#F59E0B" className="mr-1" />
            <Caption className="text-orange-700 dark:text-orange-400 font-semibold">{productivityScore}</Caption>
          </View>
        )}
      </View>
    </View>
  );
});

DashboardHero.displayName = 'DashboardHero';
