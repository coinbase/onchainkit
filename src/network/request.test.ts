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
        id: 1,
        jsonrpc: '2.0',
        method: 'exampleMethod',
        params: ['param1', 'param2'],
      };

      const response = await sendRequest('exampleMethod', ['param1', 'param2']);

      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(response).toEqual(mockResponse);
    });

    it('should throw an error if an error occurs while sending the request', async () => {
      const mockError = new Error('Example error');
      const mockFetch = jest.fn().mockRejectedValue(mockError);
      global.fetch = mockFetch;

      await expect(
        sendRequest('exampleMethod', ['param1', 'param2']),
      ).rejects.toThrow(mockError);
    });
  });
});
