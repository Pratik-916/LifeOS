import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { Icon, Label, HeadingXL, BodyMD, IconButton } from '../../../design-system';
import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

interface DashboardHeaderProps {
  firstName?: string;
}

export const DashboardHeader = React.memo(({ firstName = 'User' }: DashboardHeaderProps) => {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getQuote = () => "Small progress every day adds up.";

  return (
    <View className="flex-row justify-between items-start mb-6" accessible={true} accessibilityRole="header">
      <View className="flex-1">
        <Label className="text-slate-500 mb-1 font-semibold uppercase tracking-wider">
          {format(new Date(), 'EEEE, MMMM d')}
        </Label>
        <HeadingXL className="text-slate-900 mb-2">
          {getGreeting()}, {firstName}
        </HeadingXL>
        <BodyMD className="text-slate-600 italic">
          "{getQuote()}"
        </BodyMD>
      </View>
      
      <IconButton 
        onPress={() => navigation.navigate('Profile')}
        className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center border border-indigo-100 ml-4"
        accessibilityLabel="Open Profile"
        accessibilityRole="button"
        leftIcon="User"
      />
    </View>
  );
});
DashboardHeader.displayName = 'DashboardHeader';
