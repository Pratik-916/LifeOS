import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { LayoutDashboard, CheckSquare, Target, BookHeart, Compass } from 'lucide-react-native';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { PlannerScreen } from '../features/planner/screens/PlannerScreen';

export type BottomTabParamList = {
  Dashboard: undefined;
  Planner: undefined;
  Goals: undefined;
  Journal: undefined;
  Journey: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View className="flex-1 justify-center items-center bg-gray-50">
    <Text className="text-xl font-bold text-gray-400">{name} (Coming Soon)</Text>
  </View>
);

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Planner" 
        component={PlannerScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <CheckSquare color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={() => <PlaceholderScreen name="Goals" />} 
        options={{
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Journal" 
        component={() => <PlaceholderScreen name="Journal" />} 
        options={{
          tabBarIcon: ({ color, size }) => <BookHeart color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Journey" 
        component={() => <PlaceholderScreen name="Journey" />} 
        options={{
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};
