import { JSON_RPC_VERSION, JSON_HEADERS, POST_METHOD } from './constants.js';
import { getRPCUrl } from './getRPCUrl.js';

/**
 * Builds a JSON-RPC request body.
 *
 * @param method - The method name.
 * @param params - The parameters for the method.
 * @returns The JSON-RPC request body.
 * @template T - The type of the parameters.
 */
function buildRequestBody(method, params) {
  return {
    id: 1,
    jsonrpc: JSON_RPC_VERSION,
    method: method,
    params: params
  };
}

/**
 * Sends a JSON-RPC request to configured RPC URL.
 * Defaults to using the Coinbase Developer Platform Node.
 *
 * @param body - The JSON-RPC request body.
 * @returns A promise that resolves to the JSON-RPC response.
 * @throws If an error occurs while sending the request.
 */
async function sendRequest(method, params) {
  try {
    const body = buildRequestBody(method, params);
    const url = getRPCUrl();
    const response = await fetch(url, {
      body: JSON.stringify(body),
      headers: JSON_HEADERS,
      method: POST_METHOD
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`sendRequest: error sending request: ${error.message}`);
    throw error;
  }
}
export { buildRequestBody, sendRequest };
//# sourceMappingURL=request.js.map
