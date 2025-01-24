import { useOnchainKit } from '@/core-react/useOnchainKit';
import { sendAnalytics } from '@/core/network/sendAnalytics';
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsEvent } from '../types';
import { useAnalytics } from './useAnalytics';

vi.mock('@/core-react/useOnchainKit', () => ({
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

  it('should return sendAnalytics function and generateInteractionId', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.sendAnalytics).toBeDefined();
    expect(result.current.generateInteractionId).toBeDefined();
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

  it('should generate a valid UUID', () => {
    const mockUUID = 'test-uuid';
    const mockCrypto = {
      randomUUID: vi.fn().mockReturnValue(mockUUID),
    };
    Object.defineProperty(global, 'crypto', {
      value: mockCrypto,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useAnalytics());
    const generatedId = result.current.generateInteractionId();

    expect(generatedId).toBe(mockUUID);
    expect(mockCrypto.randomUUID).toHaveBeenCalled();
  });
});
