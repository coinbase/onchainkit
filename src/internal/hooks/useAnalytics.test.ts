import { sendAnalytics } from '@/core/network/sendAnalytics';
import { AnalyticsEvent } from '@/internal/types';
import { useOnchainKit } from '@/useOnchainKit';
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnalytics } from './useAnalytics';

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('@/core/network/sendAnalytics', () => ({
  sendAnalytics: vi.fn(),
}));

describe('useAnalytics', () => {
  const mockApiKey = 'test-api-key';
  const mockInteractionId = 'test-interaction-id';

  beforeEach(() => {
    vi.clearAllMocks();

    (useOnchainKit as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      apiKey: mockApiKey,
      interactionId: mockInteractionId,
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

  it('should call sendAnalytics with correct parameters', () => {
    const { result } = renderHook(() => useAnalytics());
    const event = AnalyticsEvent.WALLET_CONNECTED;
    const data = { address: '0x0000000000000000000000000000000000000000' };

    result.current.sendAnalytics(event, data);

    expect(sendAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        event,
        data,
        appName: expect.any(String),
        apiKey: mockApiKey,
        interactionId: mockInteractionId,
      }),
    );
  });

  it('should use document.title as appName in browser environment', () => {
    const mockTitle = 'Test App';
    Object.defineProperty(global.document, 'title', {
      value: mockTitle,
      writable: true,
    });

    const { result } = renderHook(() => useAnalytics());
    const event = AnalyticsEvent.WALLET_CONNECTED;
    const data = { address: '0x0000000000000000000000000000000000000000' };

    result.current.sendAnalytics(event, data);

    expect(sendAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        event,
        data,
        appName: mockTitle,
        apiKey: mockApiKey,
        interactionId: mockInteractionId,
      }),
    );
  });

  it('should handle analyticsUrl from config correctly', () => {
    const mockTitle = 'Test App';
    const customAnalyticsUrl = 'https://custom-analytics.example.com';

    Object.defineProperty(global.document, 'title', {
      value: mockTitle,
      writable: true,
    });

    (useOnchainKit as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      apiKey: mockApiKey,
      interactionId: mockInteractionId,
      config: {
        analyticsUrl: customAnalyticsUrl,
      },
    });

    const { result: resultWithUrl } = renderHook(() => useAnalytics());
    const event = AnalyticsEvent.WALLET_CONNECTED;
    const data = { address: '0x0000000000000000000000000000000000000000' };

    resultWithUrl.current.sendAnalytics(event, data);

    expect(sendAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsUrl: customAnalyticsUrl,
        event,
        data,
        appName: mockTitle,
        apiKey: mockApiKey,
        interactionId: mockInteractionId,
      }),
    );

    (useOnchainKit as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      apiKey: mockApiKey,
      interactionId: mockInteractionId,
      config: {
        analyticsUrl: null,
      },
    });

    const { result: resultWithNull } = renderHook(() => useAnalytics());
    resultWithNull.current.sendAnalytics(event, data);

    expect(sendAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsUrl: undefined,
        event,
        data,
        appName: mockTitle,
        apiKey: mockApiKey,
        interactionId: mockInteractionId,
      }),
    );
  });
});
