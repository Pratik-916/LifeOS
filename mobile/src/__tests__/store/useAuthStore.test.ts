import { useAuthStore } from '../../store/useAuthStore';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('mobile useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isInitializing: true,
      accessToken: null,
    });
    jest.clearAllMocks();
  });

  it('sets tokens and updates state', async () => {
    await useAuthStore.getState().setTokens('access123', 'refresh123');

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('access_token', 'access123');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refresh_token', 'refresh123');
    expect(useAuthStore.getState().accessToken).toBe('access123');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('clears tokens and updates state', async () => {
    useAuthStore.setState({ isAuthenticated: true, accessToken: 'access123' });

    await useAuthStore.getState().clearTokens();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('access_token');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refresh_token');
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('initializes auth successfully if token exists', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('access123');

    await useAuthStore.getState().initializeAuth();

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('access_token');
    expect(useAuthStore.getState().accessToken).toBe('access123');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().isInitializing).toBe(false);
  });

  it('initializes auth with false if no token', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);

    await useAuthStore.getState().initializeAuth();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().isInitializing).toBe(false);
  });

  it('handles initialization failure gracefully', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Secure store failed'));

    await useAuthStore.getState().initializeAuth();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().isInitializing).toBe(false);
  });
});
