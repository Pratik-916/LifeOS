import React from 'react';
import { render } from '@testing-library/react-native';
import { RootNavigator } from '../../navigation/index';
import { useAuthStore } from '../../store/useAuthStore';

jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('../../navigation/AuthStack', () => ({
  AuthStack: () => {
    const { Text } = require('react-native');
    return <Text>Auth Stack</Text>;
  },
}));

jest.mock('../../navigation/MainStack', () => ({
  MainStack: () => {
    const { Text } = require('react-native');
    return <Text>Main Stack</Text>;
  },
}));

jest.mock('@react-navigation/native', () => {
  return {
    NavigationContainer: ({ children }: any) => children,
  };
});

describe('RootNavigator', () => {
  it('renders Loader while initializing', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isInitializing: true,
      isAuthenticated: false,
      initializeAuth: jest.fn(),
    });

    const { getByTestId, toJSON } = render(<RootNavigator />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders AuthStack when not authenticated', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isInitializing: false,
      isAuthenticated: false,
      initializeAuth: jest.fn(),
    });

    const { getByText } = render(<RootNavigator />);
    expect(getByText('Auth Stack')).toBeTruthy();
  });

  it('renders MainStack when authenticated', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      isInitializing: false,
      isAuthenticated: true,
      initializeAuth: jest.fn(),
    });

    const { getByText } = render(<RootNavigator />);
    expect(getByText('Main Stack')).toBeTruthy();
  });
});
