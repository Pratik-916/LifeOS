import React from 'react';
import { screen } from '@testing-library/react-native';
import { mockTasksData } from '../mocks/handlers';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));

// Mock all complex sub-components
jest.mock('../../features/planner/components/TaskListItem', () => ({
  TaskListItem: ({ task }: any) => {
    const { Text } = require('react-native');
    return <Text>{task?.title}</Text>;
  },
}));
jest.mock('../../features/planner/components/PlannerStatisticsCard', () => ({
  PlannerStatisticsCard: () => null,
}));
jest.mock('../../features/planner/components/EmptyPlannerState', () => ({
  EmptyPlannerState: () => null,
}));

// Mock the tasks hook
jest.mock('../../features/planner/hooks/useTasks', () => ({
  useTasks: () => ({
    data: mockTasksData,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
}));

jest.mock('../../features/planner/hooks/usePlannerStats', () => ({
  usePlannerStats: () => ({
    data: { total: 10, completed: 5, pending: 5 },
    isLoading: false,
  }),
}));

jest.mock('../../features/planner/hooks/useTaskMutations', () => ({
  useTaskMutations: () => ({
    toggleTask: { mutate: jest.fn() },
    deleteTask: { mutate: jest.fn() },
  }),
}));

import { PlannerScreen } from '../../features/planner/screens/PlannerScreen';
import { renderWithClient } from '../utils';

describe('PlannerScreen', () => {
  it('renders without crashing', async () => {
    await renderWithClient(<PlannerScreen />);
    expect(screen.root).toBeTruthy();
  });

  it('renders task items from data', async () => {
    await renderWithClient(<PlannerScreen />);
    // Tasks come from mocked hook — TaskListItem renders title
    expect(screen.getByText('Task 1')).toBeTruthy();
    expect(screen.getByText('Task 2')).toBeTruthy();
  });
});
