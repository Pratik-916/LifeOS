import { parseApiError } from '../../api/errors';

describe('mobile parseApiError', () => {
  it('parses response data if available', () => {
    const error = {
      response: {
        data: {
          success: false,
          message: 'Invalid input',
          errors: { email: ['Required'] }
        }
      }
    };
    const parsed = parseApiError(error);
    expect(parsed.message).toBe('Invalid input');
    expect(parsed.errors).toEqual({ email: ['Required'] });
  });

  it('falls back to error message if no response data', () => {
    const error = {
      message: 'Network Error'
    };
    const parsed = parseApiError(error);
    expect(parsed.success).toBe(false);
    expect(parsed.message).toBe('Network Error');
  });

  it('falls back to default message if unknown', () => {
    const error = {};
    const parsed = parseApiError(error);
    expect(parsed.success).toBe(false);
    expect(parsed.message).toBe('An unknown network error occurred');
  });
});
