import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { getOnchainKitConfig } from '@/core/OnchainKitConfig';
import { ANALYTICS_API_URL } from '@/core/analytics/constants';
import { JSON_HEADERS } from '@/core/network/constants';
import { SwapEvent } from '@/core/analytics/types';
import {
  analyticsService,
  sendAnalyticsPayload,
  type ClientMeta,
} from './analyticsService';

// Mock dependencies
vi.mock('@/core/OnchainKitConfig');
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

describe('AnalyticsService', () => {
  const mockClientMeta: ClientMeta = {
    mode: 'onchainkit',
    clientFid: 123,
    ockVersion: '1.0.0',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset clientMeta to null before each test
    analyticsService.clientMeta = null;

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
  });

  describe('initialization', () => {
    it('should have clientMeta property accessible', () => {
      expect(analyticsService.clientMeta).toBeNull();
    });

    it('should be an object with expected methods', () => {
      expect(typeof analyticsService.setClientMeta).toBe('function');
      expect(typeof analyticsService.sendAnalytics).toBe('function');
    });
  });

  describe('setClientMeta', () => {
    it('should set client metadata', () => {
      analyticsService.setClientMeta(mockClientMeta);
      expect(analyticsService.clientMeta).toEqual(mockClientMeta);
    });

    it('should overwrite existing client metadata', () => {
      analyticsService.setClientMeta(mockClientMeta);

      const newMeta: ClientMeta = {
        mode: 'minikit',
        clientFid: 456,
        ockVersion: '2.0.0',
      };

      analyticsService.setClientMeta(newMeta);
      expect(analyticsService.clientMeta).toEqual(newMeta);
    });
  });

  describe('sendAnalytics', () => {
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

      await analyticsService.sendAnalytics(eventType, eventData);

      expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': 'Test App',
        },
        body: JSON.stringify({
          apiKey: 'test-api-key',
          sessionId: 'test-session-id',
          timestamp: MOCK_TIMESTAMP,
          eventType: eventType,
          data: eventData,
          origin: 'https://test.com',
          metadata: null,
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

      await analyticsService.sendAnalytics(eventType, eventData);

      expect(mockFetch).toHaveBeenCalledWith(customUrl, expect.any(Object));
    });

    it('should include client metadata when set', async () => {
      analyticsService.setClientMeta(mockClientMeta);
      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await analyticsService.sendAnalytics(eventType, eventData);

      expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': 'Test App',
        },
        body: JSON.stringify({
          apiKey: 'test-api-key',
          sessionId: 'test-session-id',
          timestamp: MOCK_TIMESTAMP,
          eventType: eventType,
          data: eventData,
          origin: 'https://test.com',
          metadata: mockClientMeta,
        }),
      });
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

      await analyticsService.sendAnalytics(eventType, eventData);

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

      await analyticsService.sendAnalytics(eventType, eventData);

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle fetch errors silently in production', async () => {
      process.env.NODE_ENV = 'production';
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        analyticsService.sendAnalytics(eventType, eventData),
      ).resolves.not.toThrow();

      expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should log errors in non-production environment', async () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      await analyticsService.sendAnalytics(eventType, eventData);

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

      await analyticsService.sendAnalytics(eventType, eventData);

      expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': 'Test App',
        },
        body: JSON.stringify({
          apiKey: 'undefined',
          sessionId: 'undefined',
          timestamp: MOCK_TIMESTAMP,
          eventType: eventType,
          data: eventData,
          origin: 'https://test.com',
          metadata: null,
        }),
      });
    });
  });

  describe('buildBody (private method)', () => {
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

      analyticsService.setClientMeta(mockClientMeta);
      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await analyticsService.sendAnalytics(eventType, eventData);

      const fetchCall = mockFetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);

      expect(body).toEqual({
        apiKey: 'test-api-key',
        sessionId: 'test-session-id',
        timestamp: MOCK_TIMESTAMP,
        eventType: eventType,
        data: eventData,
        origin: 'https://test.com',
        metadata: mockClientMeta,
      });

      // Verify timestamp is correct
      expect(body.timestamp).toBe(MOCK_TIMESTAMP);
    });
  });

  describe('exported singleton and bound method', () => {
    it('should export analyticsService singleton', () => {
      expect(typeof analyticsService).toBe('object');
      expect(analyticsService).toBeDefined();
    });

    it('should export sendAnalyticsPayload as bound method', () => {
      expect(typeof sendAnalyticsPayload).toBe('function');
      expect(sendAnalyticsPayload.name).toBe('bound sendAnalytics');
    });

    it('should maintain context when using bound method', async () => {
      const meta: ClientMeta = {
        mode: 'minikit',
        clientFid: 789,
        ockVersion: '1.2.3',
      };

      analyticsService.setClientMeta(meta);
      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await sendAnalyticsPayload(SwapEvent.SwapInitiated, { amount: 50 });

      expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': 'Test App',
        },
        body: JSON.stringify({
          apiKey: 'test-api-key',
          sessionId: 'test-session-id',
          timestamp: MOCK_TIMESTAMP,
          eventType: SwapEvent.SwapInitiated,
          data: { amount: 50 },
          origin: 'https://test.com',
          metadata: meta,
        }),
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty event data', async () => {
      mockFetch.mockResolvedValueOnce(new Response('{}', { status: 200 }));

      await analyticsService.sendAnalytics(SwapEvent.SwapCanceled, {});

      expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': 'Test App',
        },
        body: JSON.stringify({
          apiKey: 'test-api-key',
          sessionId: 'test-session-id',
          timestamp: MOCK_TIMESTAMP,
          eventType: SwapEvent.SwapCanceled,
          data: {},
          origin: 'https://test.com',
          metadata: null,
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

      await analyticsService.sendAnalytics(SwapEvent.SwapFailure, complexData);

      const fetchCall = mockFetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.data).toEqual(complexData);
    });
  });
});
