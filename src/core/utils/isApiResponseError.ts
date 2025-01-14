import type { APIError } from '@/core/api';

export function isApiError(response: unknown): response is APIError {
  return (
    response !== null && typeof response === 'object' && 'error' in response
  );
}
