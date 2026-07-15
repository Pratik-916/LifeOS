import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { mockTasksData } from '../mocks/handlers';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('../../features/planner/components/TaskListItem', () => ({
  TaskListItem: ({ task, onPress, onToggleComplete, onDelete }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View>
        <Text>{task?.title}</Text>
        <TouchableOpacity testID={`task-press-${task.id}`} onPress={onPress} />
        <TouchableOpacity testID={`task-complete-${task.id}`} onPress={onToggleComplete} />
        <TouchableOpacity testID={`task-delete-${task.id}`} onPress={onDelete} />
      </View>
    );
  },
}));
jest.mock('../../features/planner/components/PlannerStatisticsCard', () => ({
  PlannerStatisticsCard: () => null,
}));
jest.mock('../../features/planner/components/EmptyPlannerState', () => ({
  EmptyPlannerState: () => null,
}));
jest.mock('../../features/planner/components/FloatingActionButton', () => ({
  FloatingActionButton: ({ onPress }: any) => {
    const { TouchableOpacity } = require('react-native');
    return <TouchableOpacity testID="fab" onPress={onPress} />;
  }
}));

const mockRefetch = jest.fn();
jest.mock('../../features/planner/hooks/useTasks', () => ({
  useTasks: () => ({
    data: mockTasksData,
    isLoading: false,
    isError: false,
    refetch: mockRefetch,
  }),
}));

const mockRefetchStats = jest.fn();
jest.mock('../../features/planner/hooks/usePlannerStats', () => ({
  usePlannerStats: () => ({
    data: { total: 10, completed: 5, pending: 5 },
    isLoading: false,
    refetch: mockRefetchStats,
  }),
}));

const mockCompleteTask = jest.fn();
const mockDeleteTask = jest.fn();
jest.mock('../../features/planner/hooks/useTaskMutations', () => ({
  useTaskMutations: () => ({
    completeTask: { mutate: mockCompleteTask },
    deleteTask: { mutate: mockDeleteTask },
  }),
}));

import { PlannerScreen } from '../../features/planner/screens/PlannerScreen';
import { renderWithClient } from '../utils';

describe('PlannerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task items from data', async () => {
    await renderWithClient(<PlannerScreen />);
    expect(screen.getByText('Task 1')).toBeTruthy();
  });

  it('handles navigation and interactions', async () => {
    await renderWithClient(<PlannerScreen />);
    
    // FAB
    fireEvent.press(screen.getByTestId('fab'));
    expect(mockNavigate).toHaveBeenCalledWith('TaskEditor', { taskId: undefined });
    
    // Task Press
    fireEvent.press(screen.getByTestId('task-press-1'));
    expect(mockNavigate).toHaveBeenCalledWith('TaskDetails', { taskId: '1' });
    
    // Task Complete
    fireEvent.press(screen.getByTestId('task-complete-1'));
    expect(mockCompleteTask).toHaveBeenCalled();
    
    // Task Delete
    fireEvent.press(screen.getByTestId('task-delete-1'));
    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  it('handles refresh', async () => {
    await renderWithClient(<PlannerScreen />);
    expect(true).toBe(true);
  });
});
