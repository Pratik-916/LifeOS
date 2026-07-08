import type { AuthResponse, LoginResponse } from '../../types/auth';

const NOT_CONNECTED_ERROR = {
  success: false,
  error: {
    code: 'BACKEND_NOT_CONNECTED',
    message: 'Authentication backend is not connected yet.',
    status: 501
  }
};

// Simulate network delay for realistic UI loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse<LoginResponse>> {
    await delay(1000);
    return NOT_CONNECTED_ERROR as AuthResponse<LoginResponse>;
  },

  async signup(data: any): Promise<AuthResponse<LoginResponse>> {
    await delay(1000);
    return NOT_CONNECTED_ERROR as AuthResponse<LoginResponse>;
  },

  async logout(): Promise<AuthResponse<void>> {
    await delay(500);
    return { success: true }; // Logout can succeed locally by clearing state
  },

  async refreshToken(token: string): Promise<AuthResponse<{ accessToken: string }>> {
    await delay(500);
    return NOT_CONNECTED_ERROR as AuthResponse<{ accessToken: string }>;
  },

  async forgotPassword(email: string): Promise<AuthResponse<void>> {
    await delay(1000);
    return NOT_CONNECTED_ERROR as AuthResponse<void>;
  },

  async resetPassword(password: string, token: string): Promise<AuthResponse<void>> {
    await delay(1000);
    return NOT_CONNECTED_ERROR as AuthResponse<void>;
  },

  async verifyEmail(token: string): Promise<AuthResponse<void>> {
    await delay(1000);
    return NOT_CONNECTED_ERROR as AuthResponse<void>;
  }
};
