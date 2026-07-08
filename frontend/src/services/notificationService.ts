export const NotificationService = {
  success: (title: string, message?: string) => {
    // In the future this can connect to Zustand toast queue or sonner.
    // For now we'll just log and dispatch an event if there's a global listener.
    console.log(`[SUCCESS] ${title}${message ? `: ${message}` : ''}`);
    window.dispatchEvent(new CustomEvent('toast:success', { detail: { title, message } }));
  },
  
  error: (title: string, message?: string) => {
    console.error(`[ERROR] ${title}${message ? `: ${message}` : ''}`);
    window.dispatchEvent(new CustomEvent('toast:error', { detail: { title, message } }));
  },

  info: (title: string, message?: string) => {
    console.info(`[INFO] ${title}${message ? `: ${message}` : ''}`);
    window.dispatchEvent(new CustomEvent('toast:info', { detail: { title, message } }));
  }
};
