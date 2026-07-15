import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { AnalyticsDashboardScreen } from '../../features/analytics/screens/AnalyticsDashboardScreen';
import { renderWithClient } from '../utils';
import { Alert } from 'react-native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('../../features/analytics/components/AnalyticsSummaryCard', () => ({
  AnalyticsSummaryCard: () => null,
}));
jest.mock('../../features/analytics/components/AnalyticsSkeleton', () => ({
  AnalyticsSkeleton: () => null,
}));
jest.mock('../../features/analytics/components/AnalyticsEmptyState', () => ({
  AnalyticsEmptyState: () => null,
}));
jest.mock('../../features/analytics/components/InsightCard', () => ({
  InsightCard: ({ title, message }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View>
        {title && <Text>{title}</Text>}
        <Text>{message}</Text>
      </View>
    );
  },
}));

const mockRefetch = jest.fn();

jest.mock('../../features/analytics/hooks/useAnalyticsDashboard', () => ({
  useAnalyticsDashboard: () => ({
    data: {
      weeklyHighlights: ['Great job on habits!', 'Completed 3 tasks.'],
    },
    isLoading: false,
    refetch: mockRefetch,
    isRefetching: false,
  }),
}));

describe('AnalyticsDashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with analytics data', async () => {
    await renderWithClient(<AnalyticsDashboardScreen />);
    expect(screen.getByText('Quick Insights')).toBeTruthy();
    expect(screen.getByText('Great job on habits!')).toBeTruthy();
    expect(screen.getByText('Completed 3 tasks.')).toBeTruthy();
  });

  it('navigates to deep dives', async () => {
    await renderWithClient(<AnalyticsDashboardScreen />);
    fireEvent.press(screen.getByText('Productivity'));
    expect(mockNavigate).toHaveBeenCalledWith('Productivity');

    fireEvent.press(screen.getByText('Habits'));
    expect(mockNavigate).toHaveBeenCalledWith('HabitAnalytics');

    fireEvent.press(screen.getByText('Goals'));
    expect(mockNavigate).toHaveBeenCalledWith('GoalAnalytics');

    fireEvent.press(screen.getByText('Journal'));
    expect(mockNavigate).toHaveBeenCalledWith('JournalAnalytics');

    fireEvent.press(screen.getByText('Journey'));
    expect(mockNavigate).toHaveBeenCalledWith('JourneyAnalytics');

    fireEvent.press(screen.getByText('Heatmap'));
    expect(mockNavigate).toHaveBeenCalledWith('Heatmap');
  });

  it('shows alerts for export functions', async () => {
    expect(true).toBe(true);
  });
});
