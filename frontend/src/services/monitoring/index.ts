import * as Sentry from '@sentry/react';
import type { MonitoringProvider } from './types';
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
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    const env = import.meta.env.MODE || 'development';
    
    let sampleRate = 1.0;
    if (env === 'staging') sampleRate = 0.5;
    else if (env === 'production') sampleRate = 0.1;
    
    const version = import.meta.env.VITE_APP_VERSION || '1.0.0';
    const build = import.meta.env.VITE_BUILD_NUMBER || '0';
    const commit = import.meta.env.VITE_GIT_COMMIT || 'unknown';

    if (dsn) {
      Sentry.init({
        dsn,
        environment: env,
        release: `lifeos-web@${version}+${build}`,
        integrations: [
          Sentry.browserTracingIntegration(),
        ],
        tracesSampleRate: sampleRate,
        beforeSend: (event) => {
          // Additional privacy filters can be added here
          return event;
        },
      });
      Sentry.setTag('git_commit', commit);
      Sentry.setTag('platform', 'web');
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
}

export const monitoringService = MonitoringService.getInstance();
