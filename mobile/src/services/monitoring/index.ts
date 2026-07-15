import * as Sentry from '@sentry/react-native';
import { MonitoringProvider } from './types';
import { NoopProvider } from './NoopProvider';
import { SentryProvider } from './SentryProvider';

class MonitoringService {
  private static instance: MonitoringService;
  private provider: MonitoringProvider;

  private constructor() {
    this.provider = new NoopProvider();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  public initialize(): void {
    const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
    if (dsn) {
      Sentry.init({
        dsn,
        environment: process.env.NODE_ENV || 'development',
        release: process.env.EXPO_PUBLIC_APP_VERSION,
        tracesSampleRate: 1.0,
        beforeSend: (event) => {
          // Additional privacy filters can be added here
          return event;
        },
      });
      this.provider = new SentryProvider();
    } else {
      this.provider = new NoopProvider();
    }
  }

  public captureException(exception: Error, extras?: Record<string, any>): void {
    this.provider.captureException(exception, extras);
  }

  public captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', extras?: Record<string, any>): void {
    this.provider.captureMessage(message, level, extras);
  }

  public addBreadcrumb(message: string, category: string = 'default', level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, any>): void {
    this.provider.addBreadcrumb(message, category, level, data);
  }

  public setUser(id: string, email?: string, username?: string): void {
    this.provider.setUser(id, email, username);
  }

  public clearUser(): void {
    this.provider.clearUser();
  }

  public setTag(key: string, value: string): void {
    this.provider.setTag(key, value);
  }

  public setContext(name: string, context: Record<string, any>): void {
    this.provider.setContext(name, context);
  }

  public flush(timeout?: number): Promise<boolean> {
    return this.provider.flush(timeout);
  }

  public wrapApp<T>(component: T): T {
    return this.provider.wrapApp(component);
  }
}

export const monitoringService = MonitoringService.getInstance();
