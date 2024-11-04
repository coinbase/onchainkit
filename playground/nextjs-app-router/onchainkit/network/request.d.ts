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
export declare function buildRequestBody<T>(method: string, params: T[]): JSONRPCRequest<T>;
/**
 * Sends a JSON-RPC request to configured RPC URL.
 * Defaults to using the Coinbase Developer Platform Node.
 *
 * @param body - The JSON-RPC request body.
 * @returns A promise that resolves to the JSON-RPC response.
 * @throws If an error occurs while sending the request.
 */
export declare function sendRequest<T, V>(method: string, params: T[]): Promise<JSONRPCResult<V>>;
//# sourceMappingURL=request.d.ts.map