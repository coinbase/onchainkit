import { buildRequestBody, sendRequest } from './request';

/**
 * Makes an API request to the Swap API.
 *
 * @param method - The method to be called in the API.
 * @param params - The parameters to be passed in the API request.
 * @returns A promise that resolves to the result of the API request.
 * @throws An error if the API request fails.
 */
export async function swapAPIRequest<T, V>(method: string, params: T[]): Promise<V> {
  const body = buildRequestBody<T>(method, params);
  const res = await sendRequest<T, V>(body);
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.result;
}
