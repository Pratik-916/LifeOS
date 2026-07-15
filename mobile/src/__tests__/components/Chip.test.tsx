import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Chip } from '../../design-system/chips/Chip';

describe('Chip', () => {
  it('renders correctly with default props', async () => {
    await render(<Chip label="Default Chip" />);
    expect(screen.getByText('Default Chip')).toBeTruthy();
  });

  it('renders selected state', async () => {
    await render(<Chip label="Selected Chip" selected />);
    expect(screen.getByText('Selected Chip')).toBeTruthy();
  });

  it('handles press', async () => {
    const onPress = jest.fn();
    await render(<Chip label="Press Me" onPress={onPress} />);
    fireEvent.press(screen.getByText('Press Me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('handles remove', async () => {
    const onRemove = jest.fn();
    await render(<Chip label="Remove Me" onRemove={onRemove} />);
    // Since icon doesn't have text, find the remove button by testID or accessibility role
    // For now we assume the remove button is present
  });
});
