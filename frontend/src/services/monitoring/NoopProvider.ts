import type { MonitoringProvider } from './types';

export class NoopProvider implements MonitoringProvider {
  captureException(exception: Error, extras?: Record<string, any>): void {
    // Noop
  }
  
  captureMessage(message: string, level?: 'info' | 'warning' | 'error', extras?: Record<string, any>): void {
    // Noop
  }
  
  addBreadcrumb(message: string, category?: string, level?: 'info' | 'warning' | 'error', data?: Record<string, any>): void {
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
  
  setContext(name: string, context: Record<string, any>): void {
    // Noop
  }
  
  async flush(timeout?: number): Promise<boolean> {
    return true;
  }
}
