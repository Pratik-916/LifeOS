export interface MonitoringProvider {
  captureException(exception: Error, extras?: Record<string, any>): void;
  captureMessage(message: string, level?: 'info' | 'warning' | 'error', extras?: Record<string, any>): void;
  addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error', data?: Record<string, any>): void;
  setUser(id: string, email?: string, username?: string): void;
  clearUser(): void;
  setTag(key: string, value: string): void;
  setContext(name: string, context: Record<string, any>): void;
  flush(timeout?: number): Promise<boolean>;
}
