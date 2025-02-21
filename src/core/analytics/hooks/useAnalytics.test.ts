import {
  type ONCHAIN_KIT_CONFIG,
  getOnchainKitConfig,
} from '@/core/OnchainKitConfig';
import { ANALYTICS_API_URL } from '@/core/analytics/constants';
import { WalletEvent } from '@/core/analytics/types';
import { sendAnalytics } from '@/core/analytics/utils/sendAnalytics';
import { cleanup, renderHook } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useAnalytics } from './useAnalytics';

vi.mock('@/core/OnchainKitConfig', () => ({
  getOnchainKitConfig: vi.fn(),
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

    (getOnchainKitConfig as Mock).mockImplementation(
      (key: keyof typeof ONCHAIN_KIT_CONFIG) => {
        const config = {
          apiKey: mockApiKey,
          sessionId: mockSessionId,
          config: {
            analytics: true,
            analyticsUrl: mockAnalyticsUrl,
          },
        };
        return config[key as keyof typeof config];
      },
    );
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
    (getOnchainKitConfig as Mock).mockImplementation(
      (key: keyof typeof ONCHAIN_KIT_CONFIG) => {
        const config = {
          apiKey: mockApiKey,
          sessionId: mockSessionId,
          config: {
            analytics: false,
          },
        };
        return config[key as keyof typeof config];
      },
    );

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
    (getOnchainKitConfig as Mock).mockImplementation(
      (key: keyof typeof ONCHAIN_KIT_CONFIG) => {
        const config = {
          apiKey: mockApiKey,
          sessionId: mockSessionId,
          config: {
            analytics: true,
          },
        };
        return config[key as keyof typeof config];
      },
    );

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
    (getOnchainKitConfig as Mock).mockImplementation(
      (key: keyof typeof ONCHAIN_KIT_CONFIG) => {
        const config = {
          apiKey: undefined,
          sessionId: undefined,
          config: {
            analytics: true,
          },
        };
        return config[key as keyof typeof config];
      },
    );

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
