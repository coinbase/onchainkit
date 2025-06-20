import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { version } from '@/version';
import { clientMetaManager } from '../clientMeta/clientMetaManager';
import { setOnchainKitConfig } from '../OnchainKitConfig';
import { RequestContext } from './constants';
import { buildRequestBody, sendRequest } from './request';

vi.mock('../clientMeta/clientMetaManager');

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
    const mockGetClientMeta = clientMetaManager.getClientMeta as Mock;

    beforeEach(() => {
      mockGetClientMeta.mockResolvedValue(null);
    });

    it('should send a JSON-RPC request and return the response', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: 'exampleResult',
        id: 1,
      };
      const mockFetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
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
          'OnchainKit-Version': version,
        },
      });
      expect(response).toEqual(mockResponse);
    });

    it('should add client meta headers when available', async () => {
      const mockClientMeta = {
        mode: 'onchainkit' as const,
        clientFid: 123,
      };
      mockGetClientMeta.mockResolvedValue(mockClientMeta);

      const mockResponse = {
        jsonrpc: '2.0',
        result: 'exampleResult',
        id: 1,
      };
      const mockFetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });
      global.fetch = mockFetch;

      const requestBody = {
        id: 1,
        jsonrpc: '2.0',
        method: 'exampleMethod',
        params: ['param1', 'param2'],
      };

      await sendRequest('exampleMethod', ['param1', 'param2']);

      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'OnchainKit-Version': version,
          'OnchainKit-Client-Fid': '123',
          'OnchainKit-Mode': 'onchainkit',
        },
      });
    });

    it('should handle null client FID in client meta', async () => {
      const mockClientMeta = {
        mode: 'onchainkit' as const,
        clientFid: null,
      };
      mockGetClientMeta.mockResolvedValue(mockClientMeta);

      const mockResponse = {
        jsonrpc: '2.0',
        result: 'exampleResult',
        id: 1,
      };
      const mockFetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });
      global.fetch = mockFetch;

      const requestBody = {
        id: 1,
        jsonrpc: '2.0',
        method: 'exampleMethod',
        params: ['param1', 'param2'],
      };

      await sendRequest('exampleMethod', ['param1', 'param2']);

      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'OnchainKit-Version': version,
          'OnchainKit-Client-Fid': '',
          'OnchainKit-Mode': 'onchainkit',
        },
      });
    });

    it('should set the Onchainkit-Context if one is set', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: 'exampleResult',
        id: 1,
      };
      const mockFetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });
      global.fetch = mockFetch;

      const requestBody = {
        id: 1,
        jsonrpc: '2.0',
        method: 'exampleMethod',
        params: ['param1', 'param2'],
      };

      const response = await sendRequest(
        'exampleMethod',
        ['param1', 'param2'],
        RequestContext.API,
      );

      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'OnchainKit-Version': version,
          'OnchainKit-Context': 'api',
        },
      });
      expect(response).toEqual(mockResponse);
    });

    it('should default to api if an invalid context is set', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: 'exampleResult',
        id: 1,
      };
      const mockFetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });
      global.fetch = mockFetch;

      const requestBody = {
        id: 1,
        jsonrpc: '2.0',
        method: 'exampleMethod',
        params: ['param1', 'param2'],
      };

      const response = await sendRequest(
        'exampleMethod',
        ['param1', 'param2'],
        'fake' as RequestContext,
      );

      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'OnchainKit-Version': version,
          'OnchainKit-Context': 'api',
        },
      });
      expect(response).toEqual(mockResponse);
    });

    it('should throw an error if an error occurs while sending the request', async () => {
      const mockError = new Error('Example error');
      const mockFetch = vi.fn().mockRejectedValue(mockError);
      global.fetch = mockFetch;

      await expect(
        sendRequest('exampleMethod', ['param1', 'param2']),
      ).rejects.toThrow(mockError);
    });
  });
});
