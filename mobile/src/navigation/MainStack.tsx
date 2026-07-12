import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { MainStackParamList } from './types';

// We'll import these once created
import { TaskDetailsScreen } from '../features/planner/screens/TaskDetailsScreen';
import { TaskEditorScreen } from '../features/planner/screens/TaskEditorScreen';
import { TaskSearchScreen } from '../features/planner/screens/TaskSearchScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      <Stack.Screen 
        name="TaskDetails" 
        component={TaskDetailsScreen} 
        options={{ presentation: 'card' }}
      />
      <Stack.Screen 
        name="TaskEditor" 
        component={TaskEditorScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="TaskSearch" 
        component={TaskSearchScreen} 
        options={{ presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  );
};
