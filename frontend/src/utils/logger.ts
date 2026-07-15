import { monitoringService } from '../services/monitoring';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export const logger = {
  debug: (message: string, context?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
    monitoringService.addBreadcrumb(message, 'debug', 'info', context);
  },
  
  info: (message: string, context?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.info(`[INFO] ${message}`, context || '');
    }
    monitoringService.addBreadcrumb(message, 'info', 'info', context);
  },
  
  warn: (message: string, context?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, context || '');
    }
    monitoringService.addBreadcrumb(message, 'warn', 'warning', context);
    monitoringService.captureMessage(message, 'warning', context);
  },
  
  error: (message: string, error?: Error, context?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.error(`[ERROR] ${message}`, error || '', context || '');
    }
    monitoringService.addBreadcrumb(message, 'error', 'error', context);
    if (error) {
      monitoringService.captureException(error, context);
    } else {
      monitoringService.captureMessage(message, 'error', context);
    }
  },
  
  critical: (message: string, error?: Error, context?: Record<string, any>) => {
    if (import.meta.env.DEV) {
      console.error(`[CRITICAL] ${message}`, error || '', context || '');
    }
    monitoringService.addBreadcrumb(message, 'critical', 'error', context);
    if (error) {
      monitoringService.captureException(error, { ...context, level: 'critical' });
    } else {
      monitoringService.captureMessage(message, 'error', { ...context, level: 'critical' });
    }
  }
};
