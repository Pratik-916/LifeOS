export interface RetryStrategy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shouldRetry(error: any, retryCount: number): boolean;
  getDelay(retryCount: number): number;
}

export const defaultRetryStrategy: RetryStrategy = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shouldRetry(error: any, retryCount: number): boolean {
    const maxRetries = 5;
    if (retryCount >= maxRetries) {
      return false;
    }

    // Determine if error is temporary.
    // E.g., Axios network error or 5xx server error.
    if (!error.response) {
      // Network error (no response)
      return true;
    }
    const status = error.response.status;
    if (status >= 500 && status < 600) {
      // Server error
      return true;
    }
    if (status === 408 || status === 429) {
      // Timeout or Rate Limit
      return true;
    }

    // Do NOT retry 400 (Validation), 401 (Auth), 403 (Permission), 404 (Not Found)
    return false;
  },

  getDelay(retryCount: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000;
    const maxDelay = 30000;
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
    const jitter = Math.random() * 500;
    return delay + jitter;
  },
};
