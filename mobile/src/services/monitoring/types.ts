export interface MonitoringProvider {
  captureException(exception: Error, extras?: Record<string, unknown>): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error', extras?: Record<string, unknown>): void;
  addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error', data?: Record<string, unknown>): void;
  setUser(id: string, email?: string, username?: string): void;
  clearUser(): void;
  setTag(key: string, value: string): void;
  setContext(name: string, context: Record<string, unknown>): void;
  flush(timeout?: number): Promise<boolean>;
  wrapApp<T>(component: T): T;
}
