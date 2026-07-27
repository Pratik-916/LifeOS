import React, { useState } from 'react';
// import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CheckSquare, BookOpen, Smile } from 'lucide-react-native';

import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { PlannerScreen } from '../features/planner/screens/PlannerScreen';
import { JournalScreen } from '../features/journal/screens/JournalScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';

import { QuickAddBottomSheet } from './components/QuickAddBottomSheet';
import { CustomTabBarButton } from './components/CustomTabBarButton';
import { colors } from '../design-system/tokens/colors';

export type BottomTabParamList = {
  Today: undefined;
  Planner: undefined;
  QuickAdd: undefined;
  Journal: undefined;
  Me: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const DummyScreen = () => null;

export const BottomTabNavigator = () => {
  const [quickAddVisible, setQuickAddVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary[900],
          tabBarInactiveTintColor: colors.secondary[500],
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: -4,
            marginBottom: 4,
          },
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            height: 64,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: colors.background.light,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          }
        }}
      >
        <Tab.Screen 
          name="Today" 
          component={DashboardScreen} 
          options={{
            tabBarIcon: ({ color, focused }) => <Home color={color} size={26} strokeWidth={focused ? 2.5 : 2} />
          }}
        />
        <Tab.Screen 
          name="Planner" 
          component={PlannerScreen} 
          options={{
            tabBarIcon: ({ color, focused }) => <CheckSquare color={color} size={26} strokeWidth={focused ? 2.5 : 2} />
          }}
        />
        <Tab.Screen 
          name="QuickAdd" 
          component={DummyScreen}
          options={{
            tabBarLabel: () => null,
            tabBarButton: (props) => (
              <CustomTabBarButton 
                {...props} 
                onPress={() => setQuickAddVisible(true)} 
              />
            )
          }}
        />
        <Tab.Screen 
          name="Journal" 
          component={JournalScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <BookOpen color={color} size={26} strokeWidth={focused ? 2.5 : 2} />
            ),
          }}
        />
        <Tab.Screen 
          name="Me" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ color, focused }) => <Smile color={color} size={26} strokeWidth={focused ? 2.5 : 2} />
          }}
        />
      </Tab.Navigator>
      
      <QuickAddBottomSheet 
        visible={quickAddVisible} 
        onClose={() => setQuickAddVisible(false)} 
      />
    </>
  );
};
