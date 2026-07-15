import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button, PrimaryButton, DangerButton, GhostButton } from '../../design-system/buttons/Button';

describe('Button Component', () => {
  it('renders correctly with title', async () => {
    await render(<Button title="Press Me" />);
    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  it('calls onPress when clicked', async () => {
    const onPressMock = jest.fn();
    await render(<Button title="Clickable" onPress={onPressMock} />);
    fireEvent.press(screen.getByText('Clickable'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPressMock = jest.fn();
    await render(<Button title="Disabled" disabled onPress={onPressMock} />);
    fireEvent.press(screen.getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders PrimaryButton variant', async () => {
    await render(<PrimaryButton title="Primary" />);
    expect(screen.getByText('Primary')).toBeTruthy();
  });

  it('renders DangerButton variant', async () => {
    await render(<DangerButton title="Delete" />);
    expect(screen.getByText('Delete')).toBeTruthy();
  });

  it('renders GhostButton variant', async () => {
    await render(<GhostButton title="Ghost" />);
    expect(screen.getByText('Ghost')).toBeTruthy();
  });

  it('hides title when loading', async () => {
    await render(<Button title="Loading" loading />);
    expect(screen.queryByText('Loading')).toBeNull();
  });

  it('has correct accessibilityRole', async () => {
    await render(<Button title="Accessible" accessibilityRole="button" />);
    expect(screen.getByRole('button')).toBeTruthy();
  });
});
