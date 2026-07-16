import { MonitoringProvider } from './types';

export class NoopProvider implements MonitoringProvider {
  captureException(exception: Error, extras?: Record<string, unknown>): void {
    // Noop
  }
  
  captureMessage(message: string, level?: 'info' | 'warning' | 'error', extras?: Record<string, unknown>): void {
    // Noop
  }
  
  addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error', data?: Record<string, unknown>): void {
    // Noop
  }
  
  setUser(id: string, email?: string, username?: string): void {
    // Noop
  }
  
  clearUser(): void {
    // Noop
  }
  
  setTag(key: string, value: string): void {
    // Noop
  }
  
  setContext(name: string, context: Record<string, unknown>): void {
    // Noop
  }
  
  async flush(timeout?: number): Promise<boolean> {
    return true;
  }
  
  wrapApp<T>(component: T): T {
    return component;
  }
}
