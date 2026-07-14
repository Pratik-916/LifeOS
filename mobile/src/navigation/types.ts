import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabParamList } from './BottomTabNavigator';
import type { RouteProp } from '@react-navigation/native';

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabParamList>;
  TaskDetails: { taskId: string };
  TaskEditor: { taskId?: string };
  TaskSearch: undefined;
  HabitDetails: { habitId: string };
  HabitEditor: { habitId?: string };
  HabitSearch: undefined;
  JournalDetails: { id: string };
  JournalEditor: { id?: string };
  JournalSearch: undefined;
  GoalDetails: { id: string };
  GoalEditor: { id?: string };
  GoalSearch: undefined;
  MemoryDetails: { id: string };
  MemoryEditor: { id?: string };
  // Core
  Profile: undefined;
  MemorySearch: undefined;
  JourneyStatistics: undefined;
  
  // Analytics Module
  AnalyticsDashboard: undefined;
  Productivity: undefined;
  HabitAnalytics: undefined;
  GoalAnalytics: undefined;
  JournalAnalytics: undefined;
  JourneyAnalytics: undefined;
  Heatmap: undefined;
};

export type MemoryDetailsRouteProp = RouteProp<MainStackParamList, 'MemoryDetails'>;
export type MemoryEditorRouteProp = RouteProp<MainStackParamList, 'MemoryEditor'>;
