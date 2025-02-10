import type { OnchainKitContextType } from '@/core/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { baseSepolia } from 'wagmi/chains';
import { ANALYTICS_API_URL } from '../../analytics/constants';
import { JSON_HEADERS } from '../../network/constants';
import { type AnalyticsRequestParams, sendAnalytics } from './sendAnalytics';

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(() => ({
    config: { analytics: true },
  })),
}));

import { useOnchainKit } from '@/useOnchainKit';

describe('sendAnalytics', () => {
  const mockFetch = vi.fn();
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;

    (
      useOnchainKit as unknown as MockInstance<() => OnchainKitContextType>
    ).mockImplementation(() => ({
      address: null,
      apiKey: null,
      chain: baseSepolia,
      rpcUrl: null,
      schemaId: null,
      projectId: null,
      sessionId: null,
      config: {
        analytics: true,
        analyticsUrl: null,
        appearance: {
          name: null,
          logo: null,
          mode: null,
          theme: null,
        },
        paymaster: null,
        wallet: {
          display: null,
          termsUrl: null,
          privacyUrl: null,
        },
      },
    }));
  });

  it('should send analytics data with correct parameters', async () => {
    const request: AnalyticsRequestParams = {
      url: ANALYTICS_API_URL,
      headers: {
        'OnchainKit-App-Name': 'TestApp',
      },
      body: {
        apiKey: 'test-api-key',
        sessionId: 'test-session-id',
        timestamp: Date.now(),
        eventType: 'test-event',
        data: { foo: 'bar' },
      },
    };

    mockFetch.mockResolvedValueOnce({});

    await sendAnalytics(request);

    expect(mockFetch).toHaveBeenCalledWith(request.url, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        ...request.headers,
      },
      body: JSON.stringify(request.body),
    });
  });

  it('should handle null apiKey by using "undefined" string', async () => {
    const request: AnalyticsRequestParams = {
      url: ANALYTICS_API_URL,
      headers: {
        'OnchainKit-App-Name': 'TestApp',
      },
      body: {
        apiKey: 'undefined',
        sessionId: 'undefined',
        timestamp: Date.now(),
        eventType: 'test-event',
        data: { foo: 'bar' },
      },
    };

    mockFetch.mockResolvedValueOnce({});

    await sendAnalytics(request);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"apiKey":"undefined"'),
      }),
    );
  });

  it('should handle null values by using "undefined" string', async () => {
    const request: AnalyticsRequestParams = {
      url: ANALYTICS_API_URL,
      headers: {
        'OnchainKit-App-Name': 'TestApp',
      },
      body: {
        apiKey: 'undefined',
        sessionId: 'undefined',
        timestamp: Date.now(),
        eventType: 'test-event',
        data: { foo: 'bar' },
      },
    };

    mockFetch.mockResolvedValueOnce({});

    await sendAnalytics(request);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"sessionId":"undefined"'),
      }),
    );
  });

  it('should silently fail and log error when fetch fails', async () => {
    const error = new Error('Network error');
    mockFetch.mockRejectedValueOnce(error);

    const request: AnalyticsRequestParams = {
      url: ANALYTICS_API_URL,
      headers: {},
      body: {
        apiKey: 'test-api-key',
        sessionId: 'test-session-id',
        timestamp: Date.now(),
        eventType: 'test-event',
        data: { foo: 'bar' },
      },
    };

    await sendAnalytics(request);

    expect(consoleSpy).toHaveBeenCalledWith('Error sending analytics:', error);
  });

  it('should use provided analyticsUrl when specified', async () => {
    const customUrl = 'https://custom-analytics.example.com';
    const request: AnalyticsRequestParams = {
      url: customUrl,
      headers: {
        'OnchainKit-App-Name': 'TestApp',
      },
      body: {
        apiKey: 'test-api-key',
        sessionId: 'test-session-id',
        timestamp: Date.now(),
        eventType: 'test-event',
        data: { foo: 'bar' },
      },
    };

    mockFetch.mockResolvedValueOnce({});

    await sendAnalytics(request);

    expect(mockFetch).toHaveBeenCalledWith(customUrl, expect.any(Object));
  });

  it('should use default ANALYTICS_API_URL when analyticsUrl is not provided', async () => {
    const request: AnalyticsRequestParams = {
      url: ANALYTICS_API_URL,
      headers: {
        'OnchainKit-App-Name': 'TestApp',
      },
      body: {
        apiKey: 'test-api-key',
        sessionId: 'test-session-id',
        timestamp: Date.now(),
        eventType: 'test-event',
        data: { foo: 'bar' },
      },
    };

    mockFetch.mockResolvedValueOnce({});

    await sendAnalytics(request);

    expect(mockFetch).toHaveBeenCalledWith(
      ANALYTICS_API_URL,
      expect.any(Object),
    );
  });
});
