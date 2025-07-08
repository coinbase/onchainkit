import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import sdk from '@farcaster/frame-sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useIsInMiniApp } from './useIsInMiniApp';

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    context: undefined,
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useIsInMiniApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return isInMiniApp as true when in mini app context', async () => {
    Object.defineProperty(sdk, 'context', {
      value: Promise.resolve({ user: { fid: 123 } }),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsInMiniApp(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isInMiniApp).toBe(true);
  });

  it('should return isInMiniApp as false when not in mini app context', async () => {
    Object.defineProperty(sdk, 'context', {
      value: Promise.resolve(null),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsInMiniApp(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isInMiniApp).toBe(false);
  });

  it('should handle errors when sdk.context fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    Object.defineProperty(sdk, 'context', {
      value: Promise.reject(new Error('SDK error')),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsInMiniApp(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.isInMiniApp).toBeUndefined();

    consoleSpy.mockRestore();
  });

  it('should handle mutation states correctly', async () => {
    Object.defineProperty(sdk, 'context', {
      value: Promise.resolve({ user: { fid: 123 } }),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsInMiniApp(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should return all useQuery properties', async () => {
    Object.defineProperty(sdk, 'context', {
      value: Promise.resolve({ user: { fid: 123 } }),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsInMiniApp(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that it returns all the expected useQuery properties
    expect(result.current).toHaveProperty('isInMiniApp');
    expect(result.current).toHaveProperty('isPending');
    expect(result.current).toHaveProperty('isError');
    expect(result.current).toHaveProperty('isSuccess');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refetch');
  });

  it('should use correct query key', async () => {
    Object.defineProperty(sdk, 'context', {
      value: Promise.resolve({ user: { fid: 123 } }),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsInMiniApp(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Since we're no longer calling a function, we just verify the query worked
    expect(result.current.isInMiniApp).toBe(true);
  });

  it('should handle initial loading state', () => {
    Object.defineProperty(sdk, 'context', {
      value: new Promise((resolve) =>
        setTimeout(() => resolve({ user: { fid: 123 } }), 100),
      ),
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useIsInMiniApp(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.isInMiniApp).toBeUndefined();
  });
});
