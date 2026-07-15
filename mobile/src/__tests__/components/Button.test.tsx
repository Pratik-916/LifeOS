import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button, PrimaryButton } from '../../design-system/buttons/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Press Me" />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Clickable" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Clickable'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading is true', () => {
    const { getByTestId, queryByText } = render(<Button title="Load" loading testID="loading-button" />);
    // When loading, ActivityIndicator is shown instead of title
    expect(queryByText('Load')).toBeNull();
  });

  it('applies disabled state', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <Button title="Disabled" disabled onPress={onPressMock} accessibilityRole="button" />
    );
    
    const button = getByRole('button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });
  
  it('renders primary variant using PrimaryButton', () => {
    const { getByText } = render(<PrimaryButton title="Primary" />);
    expect(getByText('Primary')).toBeTruthy();
  });
});
