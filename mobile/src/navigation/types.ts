import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabParamList } from './BottomTabNavigator';

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<BottomTabParamList>;
  TaskDetails: { taskId: string };
  TaskEditor: { taskId?: string };
  TaskSearch: undefined;
};
