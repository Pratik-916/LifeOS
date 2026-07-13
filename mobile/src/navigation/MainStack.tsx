import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { MainStackParamList } from './types';

// We'll import these once created
import { TaskDetailsScreen } from '../features/planner/screens/TaskDetailsScreen';
import { TaskEditorScreen } from '../features/planner/screens/TaskEditorScreen';
import { TaskSearchScreen } from '../features/planner/screens/TaskSearchScreen';

import { HabitDetailsScreen } from '../features/habits/screens/HabitDetailsScreen';
import { HabitEditorScreen } from '../features/habits/screens/HabitEditorScreen';
import { HabitSearchScreen } from '../features/habits/screens/HabitSearchScreen';
import { JournalDetailsScreen } from '../features/journal/screens/JournalDetailsScreen';
import { JournalEditorScreen } from '../features/journal/screens/JournalEditorScreen';
import { JournalSearchScreen } from '../features/journal/screens/JournalSearchScreen';

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
      <Stack.Screen 
        name="HabitDetails" 
        component={HabitDetailsScreen} 
        options={{ presentation: 'card' }}
      />
      <Stack.Screen 
        name="HabitEditor" 
        component={HabitEditorScreen} 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="HabitSearch" 
        component={HabitSearchScreen}
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
      
      {/* Journal Module */}
      <Stack.Screen name="JournalDetails" component={JournalDetailsScreen} />
      <Stack.Screen 
        name="JournalEditor" 
        component={JournalEditorScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="JournalSearch" 
        component={JournalSearchScreen}
        options={{ presentation: 'transparentModal', animation: 'fade' }}
      />
    </Stack.Navigator>
  );
};
