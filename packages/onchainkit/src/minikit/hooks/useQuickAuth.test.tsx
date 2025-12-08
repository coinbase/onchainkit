import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import sdk from '@farcaster/miniapp-sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuickAuth } from './useQuickAuth';
import { useIsInMiniApp } from './useIsInMiniApp';

vi.mock('@farcaster/miniapp-sdk', () => ({
  default: {
    quickAuth: {
      fetch: vi.fn(),
    },
  },
}));

vi.mock('./useIsInMiniApp', () => ({
  useIsInMiniApp: vi.fn(),
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

describe('useQuickAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('performs a single authenticated fetch and returns data; subsequent refetch returns null', async () => {
    (useIsInMiniApp as unknown as Mock).mockReturnValue({ isInMiniApp: true });
    (sdk.quickAuth.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, userId: 123 }),
    });

    const { result } = renderHook(
      () => useQuickAuth<{ success: boolean; userId: number }>('/api/auth'),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(sdk.quickAuth.fetch).toHaveBeenCalledTimes(1);
    expect(sdk.quickAuth.fetch).toHaveBeenCalledWith('/api/auth', undefined);
    expect(result.current.data).toEqual({ success: true, userId: 123 });

    const refetchResult = await result.current.refetch();
    expect(refetchResult.data).toBeNull();
    expect(sdk.quickAuth.fetch).toHaveBeenCalledTimes(1); // still 1 due to guard
  });

  it('returns null and logs error when response.ok is false', async () => {
    (useIsInMiniApp as unknown as Mock).mockReturnValue({ isInMiniApp: true });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    (sdk.quickAuth.fetch as Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useQuickAuth('/api/auth'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    // subsequent run should also return null without calling fetch again
    const refetchResult = await result.current.refetch();
    expect(refetchResult.data).toBeNull();

    consoleSpy.mockRestore();
  });

  it('returns null when json() parsing throws after ok=true', async () => {
    (useIsInMiniApp as unknown as Mock).mockReturnValue({ isInMiniApp: true });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    (sdk.quickAuth.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('parse error');
      },
    });

    const { result } = renderHook(() => useQuickAuth('/api/auth'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    // After failure, subsequent refetch should be short-circuited
    const refetchResult = await result.current.refetch();
    expect(refetchResult.data).toBeNull();
    expect(sdk.quickAuth.fetch).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  it('returns null and logs error when quickAuth.fetch throws', async () => {
    (useIsInMiniApp as unknown as Mock).mockReturnValue({ isInMiniApp: true });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    (sdk.quickAuth.fetch as Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useQuickAuth('/api/auth'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    // Should not attempt another fetch due to hasAuthedRef set in finally
    const refetchResult = await result.current.refetch();
    expect(refetchResult.data).toBeNull();
    expect(sdk.quickAuth.fetch).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  it('does not run when not in Mini App context (enabled=false)', async () => {
    (useIsInMiniApp as unknown as Mock).mockReturnValue({ isInMiniApp: false });

    const { result } = renderHook(() => useQuickAuth('/api/auth'), {
      wrapper: createWrapper(),
    });

    // Should not auto-run
    expect(sdk.quickAuth.fetch).not.toHaveBeenCalled();
    expect(result.current.isSuccess).toBe(false);
  });

  it('honors provided useQueryOptions (e.g., staleTime) and still resolves', async () => {
    (useIsInMiniApp as unknown as Mock).mockReturnValue({ isInMiniApp: true });
    (sdk.quickAuth.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    const { result } = renderHook(
      () => useQuickAuth('/api/auth', undefined, { staleTime: 1000 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ ok: true });
  });
});
