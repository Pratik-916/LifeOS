import { environment } from './environment';

export const config = {
  api: {
    baseURL: environment.apiUrl,
    timeout: 15000,
  },
  isDevelopment: environment.env === 'development',
  isProduction: environment.env === 'production',
};
