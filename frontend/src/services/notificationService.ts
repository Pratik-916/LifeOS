import { logger } from '../utils/logger';

export const NotificationService = {
  success: (title: string, message?: string) => {
    logger.info(`[SUCCESS] ${title}${message ? `: ${message}` : ''}`);
    window.dispatchEvent(new CustomEvent('toast:success', { detail: { title, message } }));
  },
  
  error: (title: string, message?: string) => {
    logger.error(`[ERROR] ${title}${message ? `: ${message}` : ''}`);
    window.dispatchEvent(new CustomEvent('toast:error', { detail: { title, message } }));
  },

  info: (title: string, message?: string) => {
    logger.info(`[INFO] ${title}${message ? `: ${message}` : ''}`);
    window.dispatchEvent(new CustomEvent('toast:info', { detail: { title, message } }));
  }
};
