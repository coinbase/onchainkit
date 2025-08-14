import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MiniKitContext } from '../MiniKitProvider';
import type { MiniKitContextType } from '../types';
import { useMiniKit } from './useMiniKit';

const mockContext = {
  enabled: true,
  context: null,
  notificationProxyUrl: '/api/notify',
  updateClientContext: vi.fn(),
  __isMiniKit: true,
} as MiniKitContextType;

const mockDisabledContext = {
  enabled: false,
  context: null,
  notificationProxyUrl: '/api/notify',
  updateClientContext: vi.fn(),
  __isMiniKit: false,
} as MiniKitContextType;

vi.mock('@/DefaultOnchainKitProviders', () => ({
  DefaultOnchainKitProviders: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock('@/OnchainKitProvider', () => ({
  OnchainKitProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@farcaster/miniapp-wagmi-connector', () => ({
  farcasterMiniApp: vi.fn(),
}));

describe('useMiniKit', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when MiniKit is not enabled', () => {
    expect(() => {
      renderHook(() => useMiniKit(), {
        wrapper: ({ children }) => (
          <MiniKitContext.Provider value={mockDisabledContext}>
            {children}
          </MiniKitContext.Provider>
        ),
      });
    }).toThrow('MiniKit is not enabled. Please check your OnchainKitProvider.');
  });

  it('allows users to pass through ready options', async () => {
    const { result } = renderHook(() => useMiniKit(), {
      wrapper: ({ children }) => (
        <MiniKitContext.Provider value={mockContext}>
          {children}
        </MiniKitContext.Provider>
      ),
    });

    await act(async () => {
      result.current.setFrameReady({ disableNativeGestures: true });
    });

    expect(result.current.isFrameReady).toBe(true);
  });

  it('should return the correct values', () => {
    const { result } = renderHook(() => useMiniKit(), {
      wrapper: ({ children }) => (
        <MiniKitContext.Provider value={mockContext}>
          {children}
        </MiniKitContext.Provider>
      ),
    });
    expect(result.current.isFrameReady).toBe(false);
    expect(result.current.context).toEqual(mockContext.context);
    expect(result.current.notificationProxyUrl).toBe(
      mockContext.notificationProxyUrl,
    );
  });

  it('should set ready', async () => {
    const { result } = renderHook(() => useMiniKit(), {
      wrapper: ({ children }) => (
        <MiniKitContext.Provider value={mockContext}>
          {children}
        </MiniKitContext.Provider>
      ),
    });

    await act(async () => {
      result.current.setFrameReady();
    });

    expect(result.current.isFrameReady).toBe(true);
  });
});
