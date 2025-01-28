import {
  ALLOWABLE_REFERRERS,
  JSON_HEADERS,
  JSON_RPC_VERSION,
  POST_METHOD,
} from './constants';
import { getRPCUrl } from './getRPCUrl';

export type JSONRPCError = {
  code: number;
  message: string;
};

export type JSONRPCRequest<T> = {
  id: number;
  jsonrpc: string;
  method: string;
  params: T[];
};

export type JSONRPCResult<T> = {
  error?: JSONRPCError;
  id: number;
  jsonrpc: string;
  result: T;
};

export type JSONRPCReferrer = (typeof ALLOWABLE_REFERRERS)[number];

/**
 * Builds a JSON-RPC request body.
 *
 * @param method - The method name.
 * @param params - The parameters for the method.
 * @returns The JSON-RPC request body.
 * @template T - The type of the parameters.
 */
export function buildRequestBody<T>(
  method: string,
  params: T[],
): JSONRPCRequest<T> {
  return {
    id: 1,
    jsonrpc: JSON_RPC_VERSION,
    method: method,
    params: params,
  };
}

/**
 * Builds the headers for a JSON-RPC request.
 *
 * @params referrer - The referrer to add to the header
 * @returns The headers for the JSON-RPC request.
 */
export function buildRequestHeaders(
  referrer?: JSONRPCReferrer,
): Record<string, string> {
  if (referrer) {
    // if an invalid referrer is provided, default to 'api'
    if (!ALLOWABLE_REFERRERS.includes(referrer)) {
      return {
        ...JSON_HEADERS,
        'OnchainKit-Referrer': 'api',
      };
    }

    return {
      ...JSON_HEADERS,
      'OnchainKit-Referrer': referrer,
    };
  }
  return JSON_HEADERS;
}

/**
 * Sends a JSON-RPC request to configured RPC URL.
 * Defaults to using the Coinbase Developer Platform Node.
 *
 * @param method - The method name.
 * @param params - The parameters for the method.
 * @returns A promise that resolves to the JSON-RPC response.
 * @throws If an error occurs while sending the request.
 */
export async function sendRequest<T, V>(
  method: string,
  params: T[],
  referrer?: JSONRPCReferrer,
): Promise<JSONRPCResult<V>> {
  try {
    const body = buildRequestBody<T>(method, params);
    const url = getRPCUrl();
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: buildRequestHeaders(referrer),
      method: POST_METHOD,
    });
    const data: JSONRPCResult<V> = await response.json();
    return data;
  } catch (error) {
    console.log(
      `sendRequest: error sending request: ${(error as Error).message}`,
    );
    throw error;
  }
}
