import React from 'react';
import { waitFor } from '@testing-library/react-native';
import { DashboardScreen } from '../../features/dashboard/screens/DashboardScreen';
import { renderWithClient } from '../utils';

// Mock child components that might have complex rendering or animations
jest.mock('../../features/dashboard/components/InsightCarousel', () => ({
  InsightCarousel: () => null,
}));
jest.mock('../../features/dashboard/components/HeroProductivityCard', () => ({
  HeroProductivityCard: () => null,
}));

describe('DashboardScreen', () => {
  it('renders loading state initially', () => {
    const { getByTestId, toJSON } = renderWithClient(<DashboardScreen />);
    // The screen should render
    expect(toJSON()).toBeTruthy();
  });

  it('loads and displays dashboard data', async () => {
    const { getByText, findByText } = renderWithClient(<DashboardScreen />);
    
    // Check if the user name from MSW handler is rendered
    await waitFor(() => {
      expect(getByText(/John/)).toBeTruthy();
    });
  });
});
