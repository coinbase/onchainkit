import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import sdk from '@farcaster/frame-sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useComposeCast } from './useComposeCast';

const composeCastMock = {
  success: true,
};

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      composeCast: vi.fn(),
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

describe('useComposeCast', () => {
  beforeEach(() => {
    (sdk.actions.composeCast as Mock).mockResolvedValue(composeCastMock);
    vi.clearAllMocks();
  });

  it('should return composeCast and composeCastAsync functions', () => {
    const { result } = renderHook(() => useComposeCast(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.composeCast).toBe('function');
    expect(typeof result.current.composeCastAsync).toBe('function');
  });

  it('should call sdk.actions.composeCast when composeCast is executed', async () => {
    const { result } = renderHook(() => useComposeCast(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.composeCast({ text: 'Hello world!' });
    });

    await waitFor(() => {
      expect(sdk.actions.composeCast).toHaveBeenCalledWith({
        text: 'Hello world!',
      });
    });
  });

  it('should call sdk.actions.composeCast when composeCastAsync is executed', async () => {
    const { result } = renderHook(() => useComposeCast(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.composeCastAsync({ text: 'Hello world!' });
    });

    expect(sdk.actions.composeCast).toHaveBeenCalledWith({
      text: 'Hello world!',
    });
  });

  it('should pass all parameters correctly without close', async () => {
    const { result } = renderHook(() => useComposeCast(), {
      wrapper: createWrapper(),
    });

    const params = {
      text: 'Hello world!',
      embeds: ['https://example.com'] as [string],
      parent: {
        type: 'cast' as const,
        hash: '0x123',
      },
      channelKey: 'test-channel',
    };

    await act(async () => {
      result.current.composeCast(params);
    });

    await waitFor(() => {
      expect(sdk.actions.composeCast).toHaveBeenCalledWith(params);
    });
  });

  it('should handle embeds with maximum two items', async () => {
    const { result } = renderHook(() => useComposeCast(), {
      wrapper: createWrapper(),
    });

    const params = {
      text: 'Hello world!',
      embeds: ['https://example.com', 'https://example2.com'] as [
        string,
        string,
      ],
    };

    await act(async () => {
      result.current.composeCast(params);
    });

    await waitFor(() => {
      expect(sdk.actions.composeCast).toHaveBeenCalledWith(params);
    });
  });

  it('should handle empty embeds array', async () => {
    const { result } = renderHook(() => useComposeCast(), {
      wrapper: createWrapper(),
    });

    const params = {
      text: 'Hello world!',
      embeds: [] as [],
    };

    await act(async () => {
      result.current.composeCast(params);
    });

    await waitFor(() => {
      expect(sdk.actions.composeCast).toHaveBeenCalledWith(params);
    });
  });

  it('should return the compose cast result on success', async () => {
    const { result } = renderHook(() => useComposeCast(), {
      wrapper: createWrapper(),
    });

    let response;
    await act(async () => {
      response = await result.current.composeCastAsync({
        text: 'Hello world!',
      });
    });

    expect(response).toBe(composeCastMock);
  });

  it('should handle errors when composeCast fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    (sdk.actions.composeCast as Mock).mockRejectedValue(
      new Error('Compose failed'),
    );

    const { result } = renderHook(() => useComposeCast(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.composeCast({ text: 'Hello world!' });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    consoleSpy.mockRestore();
  });

  it('should handle mutation states correctly', async () => {
    const { result } = renderHook(() => useComposeCast(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    act(() => {
      result.current.composeCast({ text: 'Hello world!' });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
