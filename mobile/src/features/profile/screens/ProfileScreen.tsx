import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {  Settings as   ChevronRight, User } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/useAuthStore';
import { HeadingXL, BodyMD } from '../../../design-system/text/Typography';
import { PrimaryCard as Card } from '../../../design-system/cards/Card';
import { PrimaryButton as Button } from '../../../design-system/buttons/Button';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { offlineQueue } from '../../../services/offline';

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

  const queryClient = useQueryClient();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account and all cloud data? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete('/api/v1/users/me/');
              await AsyncStorage.clear();
              await offlineQueue.clearQueue();
              queryClient.clear();
              await logout();
            } catch (error: any) {
              const msg = error?.response?.status === 401 || error?.response?.status === 403
                ? "Your session has expired. Please log in again to delete your account."
                : !error?.response
                ? "Network error. Please check your internet connection."
                : "Failed to delete account due to a server error. Please try again later.";
              Alert.alert("Error", msg);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
      <View className="px-4 py-4 bg-background-light dark:bg-background-dark border-b border-secondary-100 dark:border-secondary-900 flex-row items-center">
        <HeadingXL className="text-text-primary mb-4">Profile</HeadingXL>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        <Card className="items-center py-8 mb-6 bg-background-light dark:bg-background-dark rounded-3xl" accessible={true} accessibilityLabel="User Info">
          <View className="w-20 h-20 bg-indigo-100 rounded-full items-center justify-center mb-4">
            <User size={40} color="#6366F1" />
          </View>
          <HeadingXL className="text-text-primary mb-4">{userData?.first_name} {userData?.last_name}</HeadingXL>
          <BodyMD className="text-text-secondary mb-6">{userData?.email}</BodyMD>
        </Card>

        <BodyMD>App Settings</BodyMD>
        <Card className="p-0 overflow-hidden mb-6 rounded-2xl bg-background-light dark:bg-background-dark" accessible={true} accessibilityRole="menu">
          <Button
            title="Privacy Policy"
            variant="ghost"
            onPress={() => Linking.openURL('https://lifeos.io/privacy')}
            className="flex-row items-center justify-between p-4 border-b border-gray-50 rounded-none h-14"
            leftIcon=""
          >
             <ChevronRight size={20} color="#9CA3AF" />
          </Button>

          <Button
            title="Terms of Service"
            variant="ghost"
            onPress={() => Linking.openURL('https://lifeos.io/terms')}
            className="flex-row items-center justify-between p-4 border-b border-gray-50 rounded-none h-14"
            leftIcon=""
          >
            <ChevronRight size={20} color="#9CA3AF" />
          </Button>

          <Button
            title="Open Source Licenses"
            variant="ghost"
            onPress={() => Linking.openURL('https://lifeos.io/licenses')}
            className="flex-row items-center justify-between p-4 border-b border-gray-50 rounded-none h-14"
            leftIcon=""
          >
            <ChevronRight size={20} color="#9CA3AF" />
          </Button>

          <Button
            title="Support"
            variant="ghost"
            onPress={() => Linking.openURL('https://lifeos.io/support')}
            className="flex-row items-center justify-between p-4 rounded-none h-14"
            leftIcon=""
          >
            <ChevronRight size={20} color="#9CA3AF" />
          </Button>
        </Card>

        <BodyMD className="text-text-secondary text-center mb-4">App Version: 1.27.1</BodyMD>

        <View className="mt-4 mb-10 space-y-4">
          <Button 
            title="Log Out" 
            onPress={logout} 
            variant="secondary"
            className="bg-red-50 py-4 rounded-xl"
            leftIcon=""
          />
          <Button 
            title="Delete Account" 
            onPress={handleDeleteAccount} 
            variant="ghost"
            className="border border-red-500 py-4 rounded-xl"
            leftIcon=""
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
