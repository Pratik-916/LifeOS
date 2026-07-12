import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../api/client';
import { useAuthStore } from '../../../store/useAuthStore';
import { Typography } from '../../../components/ui/Typography';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export const DashboardScreen = () => {
  const logout = useAuthStore((state) => state.clearTokens);

  const { data: dashboardData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/analytics/dashboard/');
      return response.data;
    }
  });

  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/users/me/');
      return response.data;
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View>
          <Typography variant="h2">Dashboard</Typography>
          <Typography variant="caption">Welcome back, {userData?.first_name || 'User'}</Typography>
        </View>
        <Button 
          title="Logout" 
          variant="ghost" 
          onPress={logout} 
          className="px-2"
        />
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {isLoading && !isRefetching ? (
          <LoadingSpinner />
        ) : (
          <View className="pb-20">
            <Typography variant="label" className="mb-2">Today's Overview</Typography>
            
            <View className="flex-row flex-wrap justify-between">
              <Card className="w-[48%] mb-4 bg-blue-50 border-blue-100">
                <Typography variant="h1" className="text-blue-600">
                  {dashboardData?.tasks?.due_today || 0}
                </Typography>
                <Typography variant="body" className="text-blue-800">Tasks Due</Typography>
              </Card>

              <Card className="w-[48%] mb-4 bg-green-50 border-green-100">
                <Typography variant="h1" className="text-green-600">
                  {dashboardData?.habits?.due_today || 0}
                </Typography>
                <Typography variant="body" className="text-green-800">Habits Due</Typography>
              </Card>

              <Card className="w-full mb-4">
                <Typography variant="h3" className="mb-1">Productivity Score</Typography>
                <Typography variant="h1" className="text-gray-900">
                  {dashboardData?.productivity_score?.score || 0}/100
                </Typography>
              </Card>
            </View>
            
            <Card className="w-full mt-4 items-center justify-center py-8">
              <Typography variant="body" className="text-center text-gray-500 mb-4">
                Mobile Foundation Phase 14 Complete!
              </Typography>
              <Typography variant="caption" className="text-center">
                React Native is successfully consuming the Django API.
              </Typography>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
