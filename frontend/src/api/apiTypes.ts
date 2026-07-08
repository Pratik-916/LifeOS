export interface ApiError {
  status: number;
  code: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
