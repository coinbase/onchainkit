import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import sdk from '@farcaster/frame-sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSwapToken } from './useSwapToken';

const swapTokenMock = {
  success: true,
};

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      swapToken: vi.fn(),
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

describe('useSwapToken', () => {
  beforeEach(() => {
    (sdk.actions.swapToken as Mock).mockResolvedValue(swapTokenMock);
    vi.clearAllMocks();
  });

  it('should return swapToken and swapTokenAsync functions', () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.swapToken).toBe('function');
    expect(typeof result.current.swapTokenAsync).toBe('function');
  });

  it('should call sdk.actions.swapToken when swapToken is executed', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      buyToken: 'eip155:10/native',
      sellAmount: '1000000',
    };

    await act(async () => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(params);
    });
  });

  it('should call sdk.actions.swapToken when swapTokenAsync is executed', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      buyToken: 'eip155:10/native',
      sellAmount: '1000000',
    };

    await act(async () => {
      await result.current.swapTokenAsync(params);
    });

    expect(sdk.actions.swapToken).toHaveBeenCalledWith(params);
  });

  it('should pass sellToken parameter correctly', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    };

    await act(async () => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(params);
    });
  });

  it('should pass buyToken parameter correctly', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      buyToken: 'eip155:10/native',
    };

    await act(async () => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(params);
    });
  });

  it('should pass sellAmount parameter correctly', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellAmount: '1000000',
    };

    await act(async () => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(params);
    });
  });

  it('should pass all parameters correctly when provided', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      buyToken: 'eip155:10/native',
      sellAmount: '1000000',
    };

    await act(async () => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(params);
    });
  });

  it('should handle empty parameters object', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {};

    await act(async () => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(params);
    });
  });

  it('should pass different token formats correctly', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    // Test with ETH native token on Ethereum mainnet
    const ethParams = {
      sellToken: 'eip155:1/native',
      buyToken: 'eip155:1/erc20:0xA0b86a33E6441D5D56b5FF87d65f2B8e9F90C54c',
      sellAmount: '1000000000000000000', // 1 ETH in wei
    };

    await act(async () => {
      result.current.swapToken(ethParams);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(ethParams);
    });
  });

  it('should pass polygon token formats correctly', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    // Test with Polygon tokens
    const polygonParams = {
      sellToken: 'eip155:137/erc20:0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
      buyToken: 'eip155:137/native', // MATIC
      sellAmount: '1000000', // 1 USDC
    };

    await act(async () => {
      result.current.swapToken(polygonParams);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(polygonParams);
    });
  });

  it('should return the swap token result on success', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      buyToken: 'eip155:10/native',
      sellAmount: '1000000',
    };

    let response;
    await act(async () => {
      response = await result.current.swapTokenAsync(params);
    });

    expect(response).toBe(swapTokenMock);
  });

  it('should handle errors when swapToken fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    (sdk.actions.swapToken as Mock).mockRejectedValue(
      new Error('Swap token failed'),
    );

    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      buyToken: 'eip155:10/native',
      sellAmount: '1000000',
    };

    await act(async () => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    consoleSpy.mockRestore();
  });

  it('should handle mutation states correctly', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    const params = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      buyToken: 'eip155:10/native',
      sellAmount: '1000000',
    };

    act(() => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle network error correctly', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    (sdk.actions.swapToken as Mock).mockRejectedValue(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      buyToken: 'eip155:10/native',
      sellAmount: '1000000',
    };

    await act(async () => {
      try {
        await result.current.swapTokenAsync(params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });

    consoleSpy.mockRestore();
  });

  it('should handle large sellAmount values', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellToken: 'eip155:1/erc20:0xA0b86a33E6441D5D56b5FF87d65f2B8e9F90C54c',
      buyToken: 'eip155:1/native',
      sellAmount: '999999999999999999999999', // Very large amount
    };

    await act(async () => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(params);
    });
  });

  it('should handle decimal sellAmount values correctly', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      buyToken: 'eip155:10/native',
      sellAmount: '1500000', // 1.5 USDC (with 6 decimals)
    };

    await act(async () => {
      result.current.swapToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(params);
    });
  });

  it('should reset mutation state on multiple calls', async () => {
    const { result } = renderHook(() => useSwapToken(), {
      wrapper: createWrapper(),
    });

    const params1 = {
      sellToken: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      sellAmount: '1000000',
    };

    const params2 = {
      buyToken: 'eip155:10/native',
      sellAmount: '2000000',
    };

    // First call
    await act(async () => {
      result.current.swapToken(params1);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Reset and second call
    await act(async () => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    await act(async () => {
      result.current.swapToken(params2);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(sdk.actions.swapToken).toHaveBeenCalledWith(params2);
    });
  });
});
