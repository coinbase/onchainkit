import type { APIError } from '@/api';

/**
 * Type guard to check if an API response is an error response.
 *
 * This utility performs runtime type checking to determine if an unknown
 * response object conforms to the APIError interface. It verifies that the
 * response is a non-null object containing an 'error' property.
 *
 * @param response - The unknown response object to check
 * @returns True if the response is an APIError, false otherwise
 *
 * @example
 * ```ts
 * const response = await fetchData();
 * if (isApiError(response)) {
 *   // TypeScript now knows response is APIError
 *   console.error(response.error);
 * } else {
 *   // Handle successful response
 *   processData(response);
 * }
 * ```
 */
export function isApiError(response: unknown): response is APIError {
  return (
    response !== null && typeof response === 'object' && 'error' in response
  );
}

