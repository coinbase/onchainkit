import {
  CONTEXT_HEADER,
  JSON_HEADERS,
  JSON_RPC_VERSION,
  POST_METHOD,
  RequestContext,
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
 * @params context - Tracks the context where the request originated
 * @returns The headers for the JSON-RPC request.
 */
export function buildRequestHeaders(
  context?: RequestContext,
): Record<string, string> {
  if (context) {
    // if an invalid context is provided, default to 'api'
    if (!Object.values(RequestContext).includes(context)) {
      return {
        ...JSON_HEADERS,
        [CONTEXT_HEADER]: RequestContext.API,
      };
    }

    return {
      ...JSON_HEADERS,
      [CONTEXT_HEADER]: context,
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
  _context?: RequestContext,
): Promise<JSONRPCResult<V>> {
  try {
    const body = buildRequestBody<T>(method, params);
    const url = getRPCUrl();
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: buildRequestHeaders(_context),
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

/**
 * Sends a JSON-RPC batch request to the configured RPC URL.
 * Each entry in the array must follow the standard JSON-RPC 2.0 request shape.
 *
 * @param requests - The array of JSON-RPC requests to execute in a single HTTP call.
 * @param _context - Tracks the context where the request originated.
 * @returns A promise that resolves to an array of JSON-RPC responses.
 */
export async function sendBatchRequest<T>(
  requests: T[],
  _context?: RequestContext,
): Promise<unknown[]> {
  try {
    const url = getRPCUrl();
    const response = await fetch(url, {
      body: JSON.stringify(requests),
      headers: buildRequestHeaders(_context),
      method: POST_METHOD,
    });
    const data = await response.json();
    return data as unknown[];
  } catch (error) {
    console.log(
      `sendBatchRequest: error sending request: ${(error as Error).message}`,
    );
    throw error;
  }
}
