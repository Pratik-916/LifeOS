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
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -4,
          marginBottom: 4,
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 0,
          shadowOpacity: 0,
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: '#FFFFFF',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => <LayoutDashboard color={focused ? '#2563EB' : color} size={26} strokeWidth={focused ? 2.5 : 2} />
        }}
      />
      <Tab.Screen 
        name="Planner" 
        component={PlannerScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => <CheckSquare color={focused ? '#2563EB' : color} size={26} strokeWidth={focused ? 2.5 : 2} />
        }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BookOpen color={focused ? '#8B5CF6' : color} size={26} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      /><Tab.Screen 
        name="Habits" 
        component={HabitScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => <Target color={focused ? '#10B981' : color} size={26} strokeWidth={focused ? 2.5 : 2} />
        }}
      />
      <Tab.Screen 
        name="Goals" 
        component={GoalScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => <Trophy color={focused ? '#F59E0B' : color} size={26} strokeWidth={focused ? 2.5 : 2} />
        }}
      />
      <Tab.Screen 
        name="Journey" 
        component={JourneyScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => <Compass color={focused ? '#14B8A6' : color} size={26} strokeWidth={focused ? 2.5 : 2} />
        }}
      />
    </Tab.Navigator>
  );
};
