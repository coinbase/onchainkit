import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MiniKitContext } from '../MiniKitProvider';
import type { MiniKitContextType } from '../types';
import { useMiniKit } from './useMiniKit';

const mockContext = {
  context: null,
  notificationProxyUrl: '/api/notify',
  updateClientContext: vi.fn(),
} as MiniKitContextType;

vi.mock('@/DefaultOnchainKitProviders', () => ({
  DefaultOnchainKitProviders: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock('@/OnchainKitProvider', () => ({
  OnchainKitProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@farcaster/miniapp-wagmi-connector', () => ({
  farcasterFrame: vi.fn(),
}));

describe('useMiniKit', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when used outside MiniKitProvider', () => {
    expect(() => {
      renderHook(() => useMiniKit());
    }).toThrow('useMiniKit must be used within a MiniKitProvider');
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
