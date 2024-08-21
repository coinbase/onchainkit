import type { CommerceApiError } from '../types/errorResponse';

export async function parseCommerceApiError(resp: Response): Promise<Error> {
  const baseErrorMessage = `${resp.status} response from Commerce`;
  try {
    const errorResponse = (await resp.json()) as CommerceApiError;
    return new Error(`${baseErrorMessage}: ${errorResponse.message}`);
  } catch (_) {
    return new Error(baseErrorMessage);
  }
}
