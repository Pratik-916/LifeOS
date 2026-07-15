import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Badge } from '../../design-system/badges/Badge';
import { View } from 'react-native';

describe('Badge', () => {
  it('renders correctly with default props', async () => {
    await render(<Badge label="New" />);
    expect(screen.getByText('New')).toBeTruthy();
  });

  it('renders variants correctly', async () => {
    await render(
      <View>
        <Badge label="Success" variant="status" colorType="success" />
        <Badge label="Warning" variant="status" colorType="warning" />
        <Badge label="Error" variant="status" colorType="danger" />
        <Badge label="Info" variant="status" colorType="info" />
      </View>
    );
    expect(screen.getByText('Success')).toBeTruthy();
    expect(screen.getByText('Warning')).toBeTruthy();
    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.getByText('Info')).toBeTruthy();
  });
});
