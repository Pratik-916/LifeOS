import { axiosInstance } from '../../api/axios';
import { tokenManager } from '../../auth/tokenManager';
import '../../api/interceptors'; // initialize interceptors
import axios from 'axios';

vi.mock('../../auth/tokenManager');

describe('Interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Request Interceptor', () => {
    it('adds Authorization header if token exists', async () => {
      (tokenManager.getAccessToken as vi.Mock).mockReturnValue('mock-token');

      // Intercept request configuration directly
      const requestHandlers = (axiosInstance.interceptors.request as any).handlers;
      const requestConfig = { headers: {} };
      
      const config = await requestHandlers[0].fulfilled(requestConfig);
      
      expect(config.headers.Authorization).toBe('Bearer mock-token');
    });

    it('does not add Authorization header if no token exists', async () => {
      (tokenManager.getAccessToken as vi.Mock).mockReturnValue(null);

      const requestHandlers = (axiosInstance.interceptors.request as any).handlers;
      const requestConfig = { headers: {} };
      
      const config = await requestHandlers[0].fulfilled(requestConfig);
      
      expect(config.headers.Authorization).toBeUndefined();
    });
  });

  describe('Response Interceptor', () => {
    it('unwraps LifeOS response structure', async () => {
      const responseHandlers = (axiosInstance.interceptors.response as any).handlers;
      
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, name: 'Test' }
        }
      };

      const res = await responseHandlers[0].fulfilled(mockResponse);
      expect(res.data).toEqual({ id: 1, name: 'Test' });
    });

    it('does not unwrap if not matching structure', async () => {
      const responseHandlers = (axiosInstance.interceptors.response as any).handlers;
      
      const mockResponse = {
        data: {
          id: 1, name: 'Test'
        }
      };

      const res = await responseHandlers[0].fulfilled(mockResponse);
      expect(res.data).toEqual({ id: 1, name: 'Test' });
    });
  });
});
