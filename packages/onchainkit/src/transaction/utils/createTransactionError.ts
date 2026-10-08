import type { APIError } from '@/api/types';

/**
 * Creates a standardized transaction error object.
 * Ensures all transaction errors follow the APIError structure consistently.
 */
export function createTransactionError(
  code: string,
  rawError: unknown,
  userMessage: string,
): APIError {
  const errorMessage =
    rawError instanceof Error
      ? rawError.message
      : typeof rawError === 'string'
        ? rawError
        : JSON.stringify(rawError);

  return {
    code,
    error: errorMessage,
    message: userMessage,
  };
}
