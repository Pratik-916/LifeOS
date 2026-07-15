import React from 'react';
import { screen } from '@testing-library/react-native';

// Mock all heavy sub-components
jest.mock('../../features/dashboard/components/InsightCarousel', () => ({
  InsightCarousel: () => null,
}));
jest.mock('../../features/dashboard/components/HeroProductivityCard', () => ({
  HeroProductivityCard: () => null,
}));
jest.mock('../../features/dashboard/components/AgendaCard', () => ({
  AgendaCard: () => null,
}));
jest.mock('../../features/dashboard/components/WeeklyProgressSection', () => ({
  WeeklyProgressSection: () => null,
}));
jest.mock('../../features/dashboard/components/QuickActions', () => ({
  QuickActions: () => null,
}));

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));

// Mock the useQuery hook directly since DashboardScreen doesn't use a custom hook
jest.mock('@tanstack/react-query', () => {
  const original = jest.requireActual('@tanstack/react-query');
  return {
    ...original,
    useQuery: jest.fn(() => ({
      data: null,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    })),
  };
});


import { DashboardScreen } from '../../features/dashboard/screens/DashboardScreen';
import { renderWithClient } from '../utils';

describe('DashboardScreen', () => {
  it('renders without crashing', async () => {
    await renderWithClient(<DashboardScreen />);
    expect(screen.root).toBeTruthy();
  });

  it('renders the screen component tree', async () => {
    await renderWithClient(<DashboardScreen />);
    expect(screen.root).toBeTruthy();
  });
});
