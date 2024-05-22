import { setOnchainKitConfig } from '../OnchainKitConfig';
import { buildRequestBody, sendRequest } from './request';

describe('request', () => {
  describe('buildRequestBody', () => {
    it('should build a JSON-RPC request body', () => {
      const method = 'exampleMethod';
      const params = ['param1', 'param2'];

      const requestBody = buildRequestBody(method, params);

      expect(requestBody).toEqual({
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: 1,
      });
    });
  });

  describe('sendRequest', () => {
    setOnchainKitConfig({ apiKey: 'test-api-key' });

    it('should send a JSON-RPC request and return the response', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: 'exampleResult',
        id: 1,
      };
      const mockFetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });
      global.fetch = mockFetch;

      const requestBody = {
        jsonrpc: '2.0',
        method: 'exampleMethod',
        params: ['param1', 'param2'],
        id: 1,
      };

      const response = await sendRequest(requestBody);

      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: expect.any(Object),
      });
      expect(response).toEqual(mockResponse);
    });

    it('should throw an error if an error occurs while sending the request', async () => {
      const mockError = new Error('Example error');
      const mockFetch = jest.fn().mockRejectedValue(mockError);
      global.fetch = mockFetch;

      const requestBody = {
        jsonrpc: '2.0',
        method: 'exampleMethod',
        params: ['param1', 'param2'],
        id: 1,
      };

      await expect(sendRequest(requestBody)).rejects.toThrow(mockError);
    });
  });
});
