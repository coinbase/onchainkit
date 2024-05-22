import { getRPCUrl } from '../getRPCUrl';

export type JSONRPCRequest<T> = {
  jsonrpc: string;
  method: string;
  params: T[];
  id: number;
};

export type JSONRPCError = {
  code: number;
  message: string;
};

export type JSONRPCResult<T> = {
  jsonrpc: string;
  result: T;
  error?: JSONRPCError;
  id: number;
};

const POST_METHOD = 'POST';
const JSON_HEADERS = {
  'Content-Type': 'application/json',
};
const JSON_RPC_VERSION = '2.0';

/**
 * Builds a JSON-RPC request body.
 *
 * @param method - The method name.
 * @param params - The parameters for the method.
 * @returns The JSON-RPC request body.
 * @template T - The type of the parameters.
 */
export function buildRequestBody<T>(method: string, params: T[]): JSONRPCRequest<T> {
  return {
    jsonrpc: JSON_RPC_VERSION,
    method: method,
    params: params,
    id: 1,
  };
}

/**
 * Sends a JSON-RPC request to configured RPC URL. Defaults to using the Coinbase Developer Platform Node.
 *
 * @param body - The JSON-RPC request body.
 * @returns A promise that resolves to the JSON-RPC response.
 * @throws If an error occurs while sending the request.
 */
export async function sendRequest<T, V>(body: JSONRPCRequest<T>): Promise<JSONRPCResult<V>> {
  try {
    const url = getRPCUrl();
    const response = await fetch(url, {
      method: POST_METHOD,
      body: JSON.stringify(body),
      headers: JSON_HEADERS,
    });
    const data: JSONRPCResult<V> = await response.json();
    return data;
  } catch (error) {
    console.log(`Error sending request: ${(error as Error).message}`);
    throw error;
  }
}
