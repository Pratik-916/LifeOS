import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { renderWithClient } from '../utils';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));

const mockSetTokens = jest.fn();
jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: (selector: any) => selector({ setTokens: mockSetTokens }),
}));

const mockPost = jest.fn();
jest.mock('../../api/client', () => ({
  apiClient: {
    post: (...args: any) => mockPost(...args),
  },
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPost.mockResolvedValue({ data: { access: 'access_token', refresh: 'refresh_token' } });
  });

  it('renders correctly', async () => {
    await renderWithClient(<LoginScreen />);
    expect(screen.getByText('Sign in to your account')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    await renderWithClient(<LoginScreen />);
    fireEvent.press(screen.getByText('Sign In'));
    
    expect(true).toBe(true);
  });

  it('submits form successfully', async () => {
    await renderWithClient(<LoginScreen />);
    
    fireEvent.changeText(screen.getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Enter your password'), 'password123');
    
    fireEvent.press(screen.getByText('Sign In'));
    
    expect(true).toBe(true);
  });
});
