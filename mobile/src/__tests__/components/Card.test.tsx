import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card, PrimaryCard, ElevatedCard } from '../../design-system/cards/Card';

describe('Card Component', () => {
  it('renders children correctly', async () => {
    await render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(screen.getByText('Card Content')).toBeTruthy();
  });

  it('calls onPress when clickable', async () => {
    const onPressMock = jest.fn();
    await render(
      <Card onPress={onPressMock}>
        <Text>Clickable Card</Text>
      </Card>
    );
    fireEvent.press(screen.getByText('Clickable Card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders PrimaryCard variant', async () => {
    await render(
      <PrimaryCard>
        <Text>Primary Content</Text>
      </PrimaryCard>
    );
    expect(screen.getByText('Primary Content')).toBeTruthy();
  });

  it('renders ElevatedCard variant', async () => {
    await render(
      <ElevatedCard>
        <Text>Elevated Content</Text>
      </ElevatedCard>
    );
    expect(screen.getByText('Elevated Content')).toBeTruthy();
  });
});
