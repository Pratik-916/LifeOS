import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { User } from 'lucide-react-native';
import { Typography } from '../../../components/ui/Typography';
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
        <Typography variant="label" className="text-slate-500 mb-1 font-semibold uppercase tracking-wider">
          {format(new Date(), 'EEEE, MMMM d')}
        </Typography>
        <Typography variant="h1" className="text-slate-900 mb-2">
          {getGreeting()}, {firstName}
        </Typography>
        <Typography variant="body" className="text-slate-600 italic">
          "{getQuote()}"
        </Typography>
      </View>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Profile')}
        className="w-12 h-12 bg-indigo-50 rounded-full items-center justify-center border border-indigo-100 ml-4"
        accessibilityLabel="Open Profile"
        accessibilityRole="button"
      >
        <User size={24} color="#6366F1" />
      </TouchableOpacity>
    </View>
  );
});
DashboardHeader.displayName = 'DashboardHeader';
