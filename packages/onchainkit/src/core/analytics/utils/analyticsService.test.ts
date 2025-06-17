import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { getOnchainKitConfig } from '@/core/OnchainKitConfig';
import { ANALYTICS_API_URL } from '@/core/analytics/constants';
import { JSON_HEADERS } from '@/core/network/constants';
import { SwapEvent } from '@/core/analytics/types';
import {
  clientMetaManager,
  type ClientMeta,
} from '@/core/clientMeta/clientMetaManager';
import { sendAnalyticsPayload } from './analyticsService';

// Mock dependencies
vi.mock('@/core/OnchainKitConfig');
vi.mock('@/core/clientMeta/clientMetaManager');
vi.mock('@/version', () => ({
  version: '1.0.0',
}));

// Mock Date.now to return consistent timestamps
const MOCK_TIMESTAMP = 1234567890123;
vi.spyOn(Date, 'now').mockReturnValue(MOCK_TIMESTAMP);

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock document and window
Object.defineProperty(document, 'title', {
  value: 'Test App',
  writable: true,
});

Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://test.com',
  },
  writable: true,
});

// Setup console.error mock
const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});

const mockGetOnchainKitConfig = getOnchainKitConfig as Mock;
const mockGetClientMeta = clientMetaManager.getClientMeta as Mock;

describe('sendAnalyticsPayload', () => {
  const mockClientMeta: ClientMeta = {
    mode: 'onchainkit',
    clientFid: 123,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset process.env.NODE_ENV to test
    process.env.NODE_ENV = 'test';

    // Default mock implementation
    mockGetOnchainKitConfig.mockImplementation((key: string) => {
      const mockConfig = {
        config: { analytics: true, analyticsUrl: null },
        apiKey: 'test-api-key',
        sessionId: 'test-session-id',
      };
      return mockConfig[key as keyof typeof mockConfig];
    });

    mockGetClientMeta.mockResolvedValue(mockClientMeta);
  });

  describe('sendAnalyticsPayload', () => {
    const eventType = SwapEvent.SwapSuccess;
    const eventData = {
      paymaster: true,
      transactionHash: '0x123',
      address: '0xabc',
      amount: 100,
      from: 'ETH',
      to: 'USDC',
    };

    it('should send analytics when enabled', async () => {
      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await sendAnalyticsPayload(eventType, eventData);

      expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': 'Test App',
          'OnchainKit-Client-Fid': '123',
          'OnchainKit-Mode': 'onchainkit',
        },
        body: JSON.stringify({
          apiKey: 'test-api-key',
          sessionId: 'test-session-id',
          timestamp: MOCK_TIMESTAMP,
          eventType: eventType,
          data: eventData,
          origin: 'https://test.com',
        }),
      });
    });

    it('should use custom analytics URL when provided', async () => {
      const customUrl = 'https://custom-analytics.com/api';
      mockGetOnchainKitConfig.mockImplementation((key: string) => {
        const mockConfig = {
          config: { analytics: true, analyticsUrl: customUrl },
          apiKey: 'test-api-key',
          sessionId: 'test-session-id',
        };
        return mockConfig[key as keyof typeof mockConfig];
      });

      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await sendAnalyticsPayload(eventType, eventData);

      expect(mockFetch).toHaveBeenCalledWith(customUrl, expect.any(Object));
    });

    it('should not send analytics when disabled', async () => {
      mockGetOnchainKitConfig.mockImplementation((key: string) => {
        const mockConfig = {
          config: { analytics: false, analyticsUrl: null },
          apiKey: 'test-api-key',
          sessionId: 'test-session-id',
        };
        return mockConfig[key as keyof typeof mockConfig];
      });

      await sendAnalyticsPayload(eventType, eventData);

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should not send analytics when config is undefined', async () => {
      mockGetOnchainKitConfig.mockImplementation((key: string) => {
        if (key === 'config') return undefined;
        const mockConfig = {
          apiKey: 'test-api-key',
          sessionId: 'test-session-id',
        };
        return mockConfig[key as keyof typeof mockConfig];
      });

      await sendAnalyticsPayload(eventType, eventData);

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle fetch errors silently in production', async () => {
      process.env.NODE_ENV = 'production';
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        sendAnalyticsPayload(eventType, eventData),
      ).resolves.not.toThrow();

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should log errors in non-production environment', async () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      await sendAnalyticsPayload(eventType, eventData);

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error sending analytics:',
        error,
      );
    });

    it('should handle undefined config values gracefully', async () => {
      mockGetOnchainKitConfig.mockImplementation((key: string) => {
        const mockConfig = {
          config: { analytics: true, analyticsUrl: null },
          apiKey: undefined,
          sessionId: undefined,
        };
        return mockConfig[key as keyof typeof mockConfig];
      });

      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await sendAnalyticsPayload(eventType, eventData);

      expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': 'Test App',
          'OnchainKit-Client-Fid': '123',
          'OnchainKit-Mode': 'onchainkit',
        },
        body: JSON.stringify({
          apiKey: 'undefined',
          sessionId: 'undefined',
          timestamp: MOCK_TIMESTAMP,
          eventType: eventType,
          data: eventData,
          origin: 'https://test.com',
        }),
      });
    });
  });

  describe('body building', () => {
    it('should build correct body structure', async () => {
      const eventType = SwapEvent.SwapSuccess;
      const eventData = {
        paymaster: true,
        transactionHash: '0x123',
        address: '0xabc',
        amount: 100,
        from: 'ETH',
        to: 'USDC',
      };

      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await sendAnalyticsPayload(eventType, eventData);

      const fetchCall = mockFetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body).toEqual({
        apiKey: 'test-api-key',
        sessionId: 'test-session-id',
        timestamp: MOCK_TIMESTAMP,
        eventType: eventType,
        data: eventData,
        origin: 'https://test.com',
      });

      // Verify timestamp is correct
      expect(body.timestamp).toBe(MOCK_TIMESTAMP);
    });
  });

  describe('edge cases', () => {
    it('should handle empty event data', async () => {
      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await sendAnalyticsPayload(SwapEvent.SwapCanceled, {});

      expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': 'Test App',
          'OnchainKit-Client-Fid': '123',
          'OnchainKit-Mode': 'onchainkit',
        },
        body: JSON.stringify({
          apiKey: 'test-api-key',
          sessionId: 'test-session-id',
          timestamp: MOCK_TIMESTAMP,
          eventType: SwapEvent.SwapCanceled,
          data: {},
          origin: 'https://test.com',
        }),
      });
    });

    it('should handle complex event data structures', async () => {
      const complexData = {
        error: 'Complex error message',
        metadata: {
          nestedObject: { value: 123 },
          array: [1, 2, 3],
          nullValue: null,
          undefinedValue: undefined,
        },
      };

      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await sendAnalyticsPayload(SwapEvent.SwapFailure, complexData);

      const fetchCall = mockFetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.data).toEqual(complexData);
    });

    it('should handle null client fid', async () => {
      const eventData = {
        paymaster: true,
        transactionHash: '0x123',
        address: '0xabc',
        amount: 100,
        from: 'ETH',
        to: 'USDC',
      };
      mockGetClientMeta.mockResolvedValue({
        mode: 'onchainkit',
        clientFid: null,
      });
      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await sendAnalyticsPayload(SwapEvent.SwapSuccess, eventData);

      expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': 'Test App',
          'OnchainKit-Client-Fid': '',
          'OnchainKit-Mode': 'onchainkit',
        },
        body: expect.any(String),
      });
    });
  });
});
