import * as Sentry from '@sentry/react-native';
import { MonitoringProvider } from './types';

export class SentryProvider implements MonitoringProvider {
  captureException(exception: Error, extras?: Record<string, any>): void {
    if (extras) {
      Sentry.withScope((scope) => {
        Object.entries(extras).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
        Sentry.captureException(exception);
      });
    } else {
      Sentry.captureException(exception);
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', extras?: Record<string, any>): void {
    if (extras) {
      Sentry.withScope((scope) => {
        Object.entries(extras).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
        Sentry.captureMessage(message, level);
      });
    } else {
      Sentry.captureMessage(message, level);
    }
  }

  addBreadcrumb(message: string, category: string = 'default', level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, any>): void {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
    });
  }

  setUser(id: string, email?: string, username?: string): void {
    Sentry.setUser({ id, email, username });
  }

  clearUser(): void {
    Sentry.setUser(null);
  }

  setTag(key: string, value: string): void {
    Sentry.setTag(key, value);
  }

  setContext(name: string, context: Record<string, any>): void {
    Sentry.setContext(name, context);
  }

  async flush(timeout?: number): Promise<boolean> {
    return Sentry.flush(timeout);
  }

  wrapApp<T>(component: T): T {
    // Sentry.wrap requires a ComponentType
    return Sentry.wrap(component as any) as unknown as T;
  }
}
