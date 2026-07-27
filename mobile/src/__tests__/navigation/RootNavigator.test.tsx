import React from 'react';
import { render, screen } from '@testing-library/react-native';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    NavigationContainer: ({ children }: any) => children,
    createNavigationContainerRef: jest.fn(() => ({
      navigate: jest.fn(),
      isReady: jest.fn(() => true),
    })),
  };
});

describe('RootNavigator', () => {
  it('renders Loader while initializing', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        isInitializing: true,
        isAuthenticated: false,
        initializeAuth: jest.fn(),
      };
      return selector(state);
    });

    await render(<RootNavigator />);
    expect(screen.root).toBeTruthy();
  });

  it('renders AuthStack when not authenticated', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        isInitializing: false,
        isAuthenticated: false,
        initializeAuth: jest.fn(),
      };
      return selector(state);
    });

    await render(<RootNavigator />);
    expect(screen.getByText('Auth Stack')).toBeTruthy();
  });

  it('renders MainStack when authenticated', async () => {
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        isInitializing: false,
        isAuthenticated: true,
        initializeAuth: jest.fn(),
      };
      return selector(state);
    });

    await render(<RootNavigator />);
    expect(screen.getByText('Main Stack')).toBeTruthy();
  });
});
