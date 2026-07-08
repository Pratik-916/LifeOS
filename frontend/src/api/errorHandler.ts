import axios, { AxiosError } from 'axios';
import type { ApiError } from './apiTypes';

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data;

    // Backend often returns { success, message, data: { ... } } or { success, error: { code, message, details } }
    if (data?.error) {
      return {
        status,
        code: data.error.code || 'UNKNOWN_ERROR',
        message: data.error.message || axiosError.message,
        fieldErrors: data.error.details || undefined,
        details: data.error.details,
      };
    }

    // Standard DRF responses without envelope
    if (data && typeof data === 'object') {
      return {
        status,
        code: 'VALIDATION_ERROR',
        message: data.detail || 'A validation error occurred',
        fieldErrors: data,
      };
    }

    return {
      status,
      code: 'NETWORK_ERROR',
      message: axiosError.message,
    };
  }

  return {
    status: 500,
    code: 'INTERNAL_ERROR',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};
