import { handleApiError } from '../../api/errorHandler';
import axios from 'axios';

describe('errorHandler', () => {
  it('handles standard axios error with backend error envelope', () => {
    const error = new axios.AxiosError('Network Error');
    error.response = {
      status: 400,
      data: {
        error: {
          code: 'INVALID_INPUT',
          message: 'Invalid credentials',
          details: { email: ['Required'] }
        }
      },
      statusText: 'Bad Request',
      headers: {},
      config: {} as any
    };

    const parsed = handleApiError(error);
    expect(parsed.status).toBe(400);
    expect(parsed.code).toBe('INVALID_INPUT');
    expect(parsed.message).toBe('Invalid credentials');
    expect(parsed.fieldErrors).toEqual({ email: ['Required'] });
  });

  it('handles DRF validation errors without envelope', () => {
    const error = new axios.AxiosError('Bad Request');
    error.response = {
      status: 400,
      data: {
        username: ['This field is required.']
      },
      statusText: 'Bad Request',
      headers: {},
      config: {} as any
    };

    const parsed = handleApiError(error);
    expect(parsed.status).toBe(400);
    expect(parsed.code).toBe('VALIDATION_ERROR');
    expect(parsed.message).toBe('A validation error occurred');
    expect(parsed.fieldErrors).toEqual({ username: ['This field is required.'] });
  });

  it('handles network errors without response data', () => {
    const error = new axios.AxiosError('Network Error');
    
    const parsed = handleApiError(error);
    expect(parsed.status).toBe(500);
    expect(parsed.code).toBe('NETWORK_ERROR');
    expect(parsed.message).toBe('Network Error');
  });

  it('handles standard JS Error', () => {
    const error = new Error('Something exploded');
    
    const parsed = handleApiError(error);
    expect(parsed.status).toBe(500);
    expect(parsed.code).toBe('INTERNAL_ERROR');
    expect(parsed.message).toBe('Something exploded');
  });

  it('handles unknown error types', () => {
    const error = "some random string error";
    
    const parsed = handleApiError(error);
    expect(parsed.status).toBe(500);
    expect(parsed.code).toBe('INTERNAL_ERROR');
    expect(parsed.message).toBe('An unknown error occurred');
  });
});
