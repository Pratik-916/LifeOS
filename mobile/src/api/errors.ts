export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export const parseApiError = (error: unknown): ApiError => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any;
  if (err.response?.data) {
    return err.response.data as ApiError;
  }
  return {
    success: false,
    message: err.message || 'An unknown network error occurred',
  };
};
