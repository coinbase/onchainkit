import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ANALYTICS_API_URL, JSON_HEADERS } from './constants';
import { sendAnalytics } from './sendAnalytics';

describe('sendAnalytics', () => {
  const mockFetch = vi.fn();
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  it('should send analytics data with correct parameters', async () => {
    const params = {
      appName: 'TestApp',
      apiKey: 'test-api-key',
      data: { foo: 'bar' },
      event: 'test-event',
      interactionId: 'test-interaction-id',
    };

    mockFetch.mockResolvedValueOnce({});

    await sendAnalytics(params);

    expect(mockFetch).toHaveBeenCalledWith(ANALYTICS_API_URL, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        'OnchainKit-App-Name': params.appName,
      },
      body: JSON.stringify({
        apiKey: params.apiKey,
        interactionId: params.interactionId,
        eventType: params.event,
        data: params.data,
      }),
    });
  });

  it('should handle null apiKey by using "undefined" string', async () => {
    const params = {
      appName: 'TestApp',
      apiKey: null,
      data: { foo: 'bar' },
      event: 'test-event',
      interactionId: 'test-interaction-id',
    };

    mockFetch.mockResolvedValueOnce({});

    await sendAnalytics(params);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"apiKey":"undefined"'),
      }),
    );
  });

  it('should handle null apiKey by using "undefined" string', async () => {
    const params = {
      appName: 'TestApp',
      apiKey: null,
      data: { foo: 'bar' },
      event: 'test-event',
      interactionId: null,
    };

    mockFetch.mockResolvedValueOnce({});

    await sendAnalytics(params);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"interactionId":"undefined"'),
      }),
    );
  });

  it('should silently fail and log error when fetch fails', async () => {
    const error = new Error('Network error');
    mockFetch.mockRejectedValueOnce(error);

    const params = {
      appName: 'TestApp',
      apiKey: 'test-api-key',
      data: { foo: 'bar' },
      event: 'test-event',
      interactionId: 'test-interaction-id',
    };

    await sendAnalytics(params);

    expect(consoleSpy).toHaveBeenCalledWith('Error sending analytics:', error);
  });
});
