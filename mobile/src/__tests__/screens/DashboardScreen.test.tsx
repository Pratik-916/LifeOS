import React from 'react';
import { screen, waitFor } from '@testing-library/react-native';

import { mockDashboardData, mockUserData } from '../mocks/handlers';

import { apiClient } from '../../api/client';

import { DashboardScreen } from '../../features/dashboard/screens/DashboardScreen';
import { renderWithClient } from '../utils';

jest.mock('../../features/dashboard/components/InsightCarousel', () => ({ InsightCarousel: () => null }));
jest.mock('../../features/dashboard/components/HeroProductivityCard', () => ({ HeroProductivityCard: () => null }));
jest.mock('../../features/dashboard/components/AgendaCard', () => ({ AgendaCard: () => null }));
jest.mock('../../features/dashboard/components/WeeklyProgressSection', () => ({ WeeklyProgressSection: () => null }));
jest.mock('../../features/dashboard/components/QuickActions', () => ({ QuickActions: () => null }));
jest.mock('../../features/dashboard/components/OverviewCard', () => ({ TodayOverview: () => null }));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));
jest.mock('../../api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

describe('DashboardScreen', () => {
  it('renders and fetches dashboard data', async () => {
    (apiClient.get as jest.Mock).mockImplementation((url: string) => {
      if (url === '/api/v1/analytics/dashboard/') return Promise.resolve({ data: mockDashboardData });
      if (url === '/api/v1/users/me/') return Promise.resolve({ data: mockUserData });
      return Promise.resolve({ data: {} });
    });

    await renderWithClient(<DashboardScreen />);
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/analytics/dashboard/');
    });
  });
});
