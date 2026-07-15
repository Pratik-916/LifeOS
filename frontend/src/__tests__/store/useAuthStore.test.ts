import { useAuthStore } from '../../store/useAuthStore';
import { tokenManager } from '../../auth/tokenManager';

vi.mock('../../auth/tokenManager', () => ({
  tokenManager: {
    clearTokens: vi.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('sets user and updates isAuthenticated', () => {
    const user = { id: '1', email: 'test@test.com', first_name: 'Test', last_name: 'User' };
    
    useAuthStore.getState().setUser(user);
    
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('sets loading state', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it('sets error state', () => {
    const error = { status: 400, code: 'ERR', message: 'Failed' };
    useAuthStore.getState().setError(error);
    expect(useAuthStore.getState().error).toEqual(error);
  });

  it('clears auth and tokens', () => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@test.com', first_name: 'Test', last_name: 'User' },
      isAuthenticated: true,
    });

    useAuthStore.getState().clearAuth();

    expect(tokenManager.clearTokens).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
