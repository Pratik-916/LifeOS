import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Banner } from '../../design-system/feedback/Banner';
import { Toast } from '../../design-system/feedback/Toast';
import { EmptyState } from '../../design-system/feedback/EmptyState';
import { Skeleton } from '../../design-system/loaders/Skeleton';
import { View } from 'react-native';

describe('Design System Components', () => {
  it('renders Banner correctly', async () => {
    await render(<Banner message="Banner message" type="info" />);
    expect(screen.getByText('Banner message')).toBeTruthy();
  });

  it('renders Toast correctly', async () => {
    await render(<Toast message="Toast message" type="success" visible={true} onHide={() => {}} />);
    expect(screen.getByText('Toast message')).toBeTruthy();
  });

  it('renders EmptyState correctly', async () => {
    await render(<EmptyState title="Empty Title" message="Empty message" icon="Inbox" />);
    expect(screen.getByText('Empty Title')).toBeTruthy();
    expect(true).toBe(true);
  });

  it('renders Skeleton correctly', async () => {
    await render(
      <View>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={200} height={100} />
      </View>
    );
  });
});
