import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Card, PrimaryCard } from '../../design-system/cards/Card';
import { Text } from 'react-native';

describe('Card Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('calls onPress when clickable', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Card onPress={onPressMock}>
        <Text>Clickable Card</Text>
      </Card>
    );
    
    fireEvent.press(getByText('Clickable Card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders primary variant using PrimaryCard', () => {
    const { getByText } = render(
      <PrimaryCard>
        <Text>Primary Content</Text>
      </PrimaryCard>
    );
    expect(getByText('Primary Content')).toBeTruthy();
  });
});
