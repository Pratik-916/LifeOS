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
  MemorySearch: undefined;
};

export type MemoryDetailsRouteProp = RouteProp<MainStackParamList, 'MemoryDetails'>;
export type MemoryEditorRouteProp = RouteProp<MainStackParamList, 'MemoryEditor'>;
