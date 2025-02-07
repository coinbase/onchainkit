import { ANALYTICS_API_URL } from '@/core/analytics/constants';
import { WalletEvent } from '@/core/analytics/types';
import { sendAnalytics } from '@/core/analytics/utils/sendAnalytics';
import { useOnchainKit } from '@/useOnchainKit';
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnalytics } from './useAnalytics';

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('@/core/analytics/utils/sendAnalytics', () => ({
  sendAnalytics: vi.fn(),
}));

describe('useAnalytics', () => {
  const mockApiKey = 'test-api-key';
  const mockSessionId = 'test-session-id';
  const mockAnalyticsUrl = 'https://custom-analytics.example.com';

  beforeEach(() => {
    vi.clearAllMocks();

    (useOnchainKit as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      apiKey: mockApiKey,
      sessionId: mockSessionId,
      config: {
        analytics: true,
        analyticsUrl: mockAnalyticsUrl,
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should return sendAnalytics function', () => {
    const { result } = renderHook(() => useAnalytics());
    expect(result.current.sendAnalytics).toBeDefined();
  });

  it('should call sendAnalytics with correct payload structure', () => {
    const mockTitle = 'Test App';
    Object.defineProperty(global.document, 'title', {
      value: mockTitle,
      writable: true,
    });

    const { result } = renderHook(() => useAnalytics());
    const event = WalletEvent.ConnectInitiated;
    const data = {
      component: 'ConnectWallet',
      walletProvider: 'TestProvider',
    };

    result.current.sendAnalytics(event, data);

    expect(sendAnalytics).toHaveBeenCalledWith({
      url: mockAnalyticsUrl,
      headers: {
        'OnchainKit-App-Name': mockTitle,
      },
      body: {
        apiKey: mockApiKey,
        sessionId: mockSessionId,
        timestamp: expect.any(Number),
        eventType: event,
        data,
      },
    });
  });

  it('should not send analytics when disabled in config', () => {
    (useOnchainKit as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      apiKey: mockApiKey,
      sessionId: mockSessionId,
      config: {
        analytics: false,
      },
    });

    const { result } = renderHook(() => useAnalytics());
    const event = WalletEvent.ConnectSuccess;
    const data = {
      address: '0x0000000000000000000000000000000000000000',
      component: 'ConnectWallet',
      walletProvider: 'TestProvider',
    };

    result.current.sendAnalytics(event, data);

    expect(sendAnalytics).not.toHaveBeenCalled();
  });

  it('should use default analytics URL when not provided in config', () => {
    (useOnchainKit as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      apiKey: mockApiKey,
      sessionId: mockSessionId,
      config: {
        analytics: true,
      },
    });

    const { result } = renderHook(() => useAnalytics());
    const event = WalletEvent.ConnectError;
    const data = {
      error: 'Test error message',
      metadata: {
        connector: 'TestProvider',
      },
    };

    result.current.sendAnalytics(event, data);

    expect(sendAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        url: ANALYTICS_API_URL,
      }),
    );
  });

  it('should handle undefined apiKey and sessionId', () => {
    (useOnchainKit as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      apiKey: undefined,
      sessionId: undefined,
      config: {
        analytics: true,
      },
    });

    const { result } = renderHook(() => useAnalytics());
    const event = WalletEvent.ConnectInitiated;
    const data = {
      component: 'ConnectWallet',
      walletProvider: 'TestProvider',
    };

    result.current.sendAnalytics(event, data);

    expect(sendAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          apiKey: 'undefined',
          sessionId: 'undefined',
        }),
      }),
    );
  });
});
