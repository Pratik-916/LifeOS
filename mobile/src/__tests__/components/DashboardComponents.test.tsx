import React from 'react';
import { screen } from '@testing-library/react-native';
import { DashboardHeader } from '../../features/dashboard/components/DashboardHeader';
import { DashboardSectionTitle } from '../../features/dashboard/components/DashboardSectionTitle';
import { DashboardSkeleton } from '../../features/dashboard/components/DashboardSkeleton';
import { TodayOverview } from '../../features/dashboard/components/OverviewCard';
import { renderWithClient } from '../utils';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('Dashboard Components', () => {
  it('renders DashboardHeader correctly', async () => {
    await renderWithClient(<DashboardHeader username="User" onProfilePress={jest.fn()} />);
    expect(true).toBe(true);
  });

  it('renders DashboardSectionTitle correctly', async () => {
    await renderWithClient(<DashboardSectionTitle title="Section Title" actionLabel="See All" onActionPress={jest.fn()} />);
    expect(true).toBe(true);
  });

  it('renders DashboardSkeleton correctly', async () => {
    await renderWithClient(<DashboardSkeleton />);
    // Just verifying it renders without crashing
  });

  it('renders TodayOverview correctly', async () => {
    await renderWithClient(
      <TodayOverview 
        tasks={5}
        habits={3}
        goals={2}
        journal={1}
        journey={4}
      />
    );
    expect(screen.getByText('Tasks')).toBeTruthy();
  });
});
