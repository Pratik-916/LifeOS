import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Loader } from '../../design-system/loaders/Loader';

describe('Loader Component', () => {
  it('renders without crashing', async () => {
    await render(<Loader testID="loader" />);
    expect(screen.getByTestId('loader')).toBeTruthy();
  });

  it('renders with small size prop', async () => {
    await render(<Loader size="small" testID="loader" />);
    expect(screen.getByTestId('loader')).toBeTruthy();
  });

  it('renders with custom color', async () => {
    await render(<Loader color="#FF0000" testID="loader" />);
    expect(screen.getByTestId('loader')).toBeTruthy();
  });
});
