export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  status?: number;
}

export interface AuthResponse<T = void> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface LoginResponse {
  user: User;
  session: Session;
}
