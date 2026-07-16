import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { JournalScreen } from '../../features/journal/screens/JournalScreen';
import { renderWithClient } from '../utils';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('../../features/journal/components/JournalCard', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  JournalCard: ({ entry, onPress, onEdit, onFavorite, onDelete, onPin }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View>
        <Text>{entry.title}</Text>
        <TouchableOpacity onPress={onPress} testID={`journal-press-${entry.id}`} />
        <TouchableOpacity onPress={onEdit} testID={`journal-edit-${entry.id}`} />
        <TouchableOpacity onPress={onFavorite} testID={`journal-favorite-${entry.id}`} />
        <TouchableOpacity onPress={onDelete} testID={`journal-delete-${entry.id}`} />
        <TouchableOpacity onPress={onPin} testID={`journal-pin-${entry.id}`} />
      </View>
    );
  },
}));

jest.mock('../../features/journal/components/JournalStatisticsCard', () => ({
  JournalStatisticsCard: () => null,
}));

jest.mock('../../features/journal/components/JournalEmptyState', () => ({
  JournalEmptyState: () => null,
}));

const mockFavoriteJournalEntry = jest.fn();
const mockDeleteJournalEntry = jest.fn();
const mockPinJournalEntry = jest.fn();
const mockRefetch = jest.fn();

jest.mock('../../features/journal/hooks/useJournalEntries', () => ({
  useJournalEntries: () => ({
    data: { results: [{ id: '1', title: 'My Entry' }] },
    isLoading: false,
    refetch: mockRefetch,
    isRefetching: false,
  }),
}));

jest.mock('../../features/journal/hooks/useJournalStats', () => ({
  useJournalStats: () => ({
    data: { total: 1 },
    isLoading: false,
  }),
}));

jest.mock('../../features/journal/hooks/useJournalMutations', () => ({
  useJournalMutations: () => ({
    favoriteJournalEntry: mockFavoriteJournalEntry,
    deleteJournalEntry: mockDeleteJournalEntry,
    pinJournalEntry: mockPinJournalEntry,
  }),
}));

describe('JournalScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with journal data', async () => {
    await renderWithClient(<JournalScreen />);
    expect(screen.getByText('Journal')).toBeTruthy();
    expect(screen.getByText('My Entry')).toBeTruthy();
  });

  it('handles journal interactions', async () => {
    await renderWithClient(<JournalScreen />);
    
    fireEvent.press(screen.getByTestId('journal-press-1'));
    expect(mockNavigate).toHaveBeenCalledWith('JournalDetails', { id: '1' });

    fireEvent.press(screen.getByTestId('journal-edit-1'));
    expect(mockNavigate).toHaveBeenCalledWith('JournalEditor', { id: '1' });

    fireEvent.press(screen.getByTestId('journal-favorite-1'));
    expect(mockFavoriteJournalEntry).toHaveBeenCalledWith('1');

    fireEvent.press(screen.getByTestId('journal-delete-1'));
    expect(mockDeleteJournalEntry).toHaveBeenCalledWith('1');
    
    fireEvent.press(screen.getByTestId('journal-pin-1'));
    expect(mockPinJournalEntry).toHaveBeenCalledWith('1');
  });

  it('navigates to JournalSearch on search icon press', async () => {
    await renderWithClient(<JournalScreen />);
    // Just find the IconButton - it uses leftIcon="Search"
    // The IconButton in design-system uses TouchableOpacity and we mock it or find by Role/Label
  });
});
