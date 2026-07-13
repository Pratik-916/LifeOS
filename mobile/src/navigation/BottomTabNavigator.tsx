import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, CheckSquare, Target, Compass, BookOpen } from 'lucide-react-native';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { PlannerScreen } from '../features/planner/screens/PlannerScreen';
import { HabitScreen } from '../features/habits/screens/HabitScreen';
import { JournalScreen } from '../features/journal/screens/JournalScreen';
import { GoalScreen } from '../features/goals/screens/GoalScreen';
import { JourneyScreen } from '../features/journey/screens/JourneyScreen';
import { Trophy } from 'lucide-react-native';

export type BottomTabParamList = {
  Dashboard: undefined;
  Planner: undefined;
  Habits: undefined;
  Journal: undefined;
  Goals: undefined;
  Journey: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

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
        name="Journal" 
        component={JournalScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      /><Tab.Screen 
        name="Habits" 
        component={HabitScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Journey" 
        component={JourneyScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
};
