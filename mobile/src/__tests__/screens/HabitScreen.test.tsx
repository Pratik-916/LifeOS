import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { HabitScreen } from '../../features/habits/screens/HabitScreen';
import { renderWithClient } from '../utils';
import { mockHabitsData } from '../mocks/handlers';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('../../features/habits/components/HabitCard', () => ({
  HabitCard: ({ habit, onPress, onLogCompletion, onArchive }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View>
        <Text>{habit.name}</Text>
        <TouchableOpacity onPress={onPress} testID={`habit-press-${habit.id}`} />
        <TouchableOpacity onPress={onLogCompletion} testID={`habit-log-${habit.id}`} />
        <TouchableOpacity onPress={onArchive} testID={`habit-archive-${habit.id}`} />
      </View>
    );
  },
}));

jest.mock('../../features/habits/components/HabitStatisticsCard', () => ({
  HabitStatisticsCard: () => null,
}));

jest.mock('../../features/habits/components/EmptyHabitsState', () => ({
  EmptyHabitsState: () => null,
}));

const mockLogHabit = jest.fn();
const mockArchiveHabit = jest.fn();
const mockRefetch = jest.fn();
const mockRefetchStats = jest.fn();

jest.mock('../../features/habits/hooks/useHabits', () => ({
  useHabits: () => ({
    data: { results: [{ id: '1', name: 'Exercise', currentCount: 0, targetCount: 1 }] },
    isLoading: false,
    refetch: mockRefetch,
  }),
}));

jest.mock('../../features/habits/hooks/useHabitStats', () => ({
  useHabitStats: () => ({
    data: { total: 2, active: 2, completed_today: 1 },
    isLoading: false,
    refetch: mockRefetchStats,
  }),
}));

jest.mock('../../features/habits/hooks/useHabitMutations', () => ({
  useHabitMutations: () => ({
    logHabit: { mutate: mockLogHabit },
    archiveHabit: { mutate: mockArchiveHabit },
  }),
}));

describe('HabitScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with habit data', async () => {
    await renderWithClient(<HabitScreen />);
    expect(screen.getByText('Habits')).toBeTruthy();
    expect(screen.getByText('Exercise')).toBeTruthy();
  });

  it('navigates to HabitSearch on search button press', async () => {
    await renderWithClient(<HabitScreen />);
    const searchBtn = screen.getByLabelText('Search habits');
    fireEvent.press(searchBtn);
    expect(mockNavigate).toHaveBeenCalledWith('HabitSearch');
  });

  it('navigates to HabitEditor on FAB press', async () => {
    await renderWithClient(<HabitScreen />);
    const fab = screen.getByLabelText('Create Habit');
    fireEvent.press(fab);
    expect(mockNavigate).toHaveBeenCalledWith('HabitEditor', { habitId: undefined });
  });

  it('handles habit card interactions', async () => {
    await renderWithClient(<HabitScreen />);
    
    // skip test
    fireEvent.press(screen.getByTestId('habit-press-1'));
    expect(mockNavigate).toHaveBeenCalledWith('HabitDetails', { habitId: '1' });

    // Log completion
    fireEvent.press(screen.getByTestId('habit-log-1'));
    expect(mockLogHabit).toHaveBeenCalled();

    // Archive
    fireEvent.press(screen.getByTestId('habit-archive-1'));
    expect(mockArchiveHabit).toHaveBeenCalledWith('1');
  });
});
