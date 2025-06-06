import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import sdk from '@farcaster/frame-sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useViewCast } from './useViewCast';

const viewCastMock = {
  success: true,
};

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      viewCast: vi.fn(),
    },
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

describe('useViewCast', () => {
  beforeEach(() => {
    (sdk.actions.viewCast as Mock).mockResolvedValue(viewCastMock);
    vi.clearAllMocks();
  });

  it('should return viewCast and viewCastAsync functions', () => {
    const { result } = renderHook(() => useViewCast(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.viewCast).toBe('function');
    expect(typeof result.current.viewCastAsync).toBe('function');
  });

  it('should call sdk.actions.viewCast when viewCast is executed', async () => {
    const { result } = renderHook(() => useViewCast(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.viewCast({ hash: '0x123' });
    });

    await waitFor(() => {
      expect(sdk.actions.viewCast).toHaveBeenCalledWith({
        hash: '0x123',
      });
    });
  });

  it('should call sdk.actions.viewCast when viewCastAsync is executed', async () => {
    const { result } = renderHook(() => useViewCast(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.viewCastAsync({ hash: '0x123' });
    });

    expect(sdk.actions.viewCast).toHaveBeenCalledWith({
      hash: '0x123',
    });
  });

  it('should pass hash parameter correctly', async () => {
    const { result } = renderHook(() => useViewCast(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.viewCast({ hash: '0xabcdef123456' });
    });

    await waitFor(() => {
      expect(sdk.actions.viewCast).toHaveBeenCalledWith({
        hash: '0xabcdef123456',
      });
    });
  });

  it('should pass hash and close parameters correctly', async () => {
    const { result } = renderHook(() => useViewCast(), {
      wrapper: createWrapper(),
    });

    const params = {
      hash: '0x123',
      close: true,
    };

    await act(async () => {
      result.current.viewCast(params);
    });

    await waitFor(() => {
      expect(sdk.actions.viewCast).toHaveBeenCalledWith(params);
    });
  });

  it('should pass hash and close false parameters correctly', async () => {
    const { result } = renderHook(() => useViewCast(), {
      wrapper: createWrapper(),
    });

    const params = {
      hash: '0x123',
      close: false,
    };

    await act(async () => {
      result.current.viewCast(params);
    });

    await waitFor(() => {
      expect(sdk.actions.viewCast).toHaveBeenCalledWith(params);
    });
  });

  it('should return the view cast result on success', async () => {
    const { result } = renderHook(() => useViewCast(), {
      wrapper: createWrapper(),
    });

    let response;
    await act(async () => {
      response = await result.current.viewCastAsync({ hash: '0x123' });
    });

    expect(response).toBe(viewCastMock);
  });

  it('should handle errors when viewCast fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    (sdk.actions.viewCast as Mock).mockRejectedValue(
      new Error('View cast failed'),
    );

    const { result } = renderHook(() => useViewCast(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.viewCast({ hash: '0x123' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    consoleSpy.mockRestore();
  });

  it('should handle mutation states correctly', async () => {
    const { result } = renderHook(() => useViewCast(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    act(() => {
      result.current.viewCast({ hash: '0x123' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
