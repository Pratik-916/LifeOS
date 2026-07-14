import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LogOut, Settings as SettingsIcon, BarChart2, ChevronRight, User } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/useAuthStore';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

import type { NavigationProp } from '@react-navigation/native';
import type { MainStackParamList } from '../../../navigation/types';

export const ProfileScreen = () => {
  const logout = useAuthStore((state) => state.clearTokens);
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/users/me/');
      return response.data;
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-100 flex-row items-center">
        <Typography variant="h2" className="flex-1 text-center mr-8">Profile</Typography>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <Card className="items-center py-8 mb-6 bg-white rounded-3xl" accessible={true} accessibilityLabel="User Info">
          <View className="w-20 h-20 bg-indigo-100 rounded-full items-center justify-center mb-4">
            <User size={40} color="#6366F1" />
          </View>
          <Typography variant="h2" className="mb-1">{userData?.first_name} {userData?.last_name}</Typography>
          <Typography variant="body" className="text-gray-500">{userData?.email}</Typography>
        </Card>

        <Typography variant="label" className="text-gray-500 mb-2 ml-2">App Settings</Typography>
        <Card className="p-0 overflow-hidden mb-6 rounded-2xl bg-white" accessible={true} accessibilityRole="menu">
          <Button
            title="Analytics Dashboard"
            variant="ghost"
            onPress={() => navigation.navigate('AnalyticsDashboard')}
            className="flex-row items-center justify-between p-4 border-b border-gray-50 rounded-none h-14"
            icon={<BarChart2 size={20} color="#2563EB" className="mr-3" />}
          >
             <ChevronRight size={20} color="#9CA3AF" />
          </Button>

          <Button
            title="Theme Settings"
            variant="ghost"
            onPress={() => {}}
            className="flex-row items-center justify-between p-4 rounded-none h-14"
            icon={<SettingsIcon size={20} color="#6B7280" className="mr-3" />}
          >
            <ChevronRight size={20} color="#9CA3AF" />
          </Button>
        </Card>

        <View className="mt-4 mb-10">
          <Button 
            title="Log Out" 
            onPress={logout} 
            variant="secondary"
            className="bg-red-50 py-4 rounded-xl"
            icon={<LogOut size={20} color="#EF4444" className="mr-2" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
