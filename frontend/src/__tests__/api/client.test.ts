import { apiClient } from '../../api/client';
import { axiosInstance } from '../../api/axios';

vi.mock('../../api/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}));

describe('apiClient', () => {
  it('calls axios get', () => {
    apiClient.get('/test');
    expect(axiosInstance.get).toHaveBeenCalledWith('/test', undefined);
  });
  
  it('calls axios post', () => {
    apiClient.post('/test', { data: 1 });
    expect(axiosInstance.post).toHaveBeenCalledWith('/test', { data: 1 }, undefined);
  });
  
  it('calls axios put', () => {
    apiClient.put('/test', { data: 1 });
    expect(axiosInstance.put).toHaveBeenCalledWith('/test', { data: 1 }, undefined);
  });
  
  it('calls axios patch', () => {
    apiClient.patch('/test', { data: 1 });
    expect(axiosInstance.patch).toHaveBeenCalledWith('/test', { data: 1 }, undefined);
  });
  
  it('calls axios delete', () => {
    apiClient.delete('/test');
    expect(axiosInstance.delete).toHaveBeenCalledWith('/test', undefined);
  });
});
