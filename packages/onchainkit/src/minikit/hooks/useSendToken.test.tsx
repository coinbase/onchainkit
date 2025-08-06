import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import sdk from '@farcaster/frame-sdk';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSendToken } from './useSendToken';

const sendTokenMock = {
  success: true,
};

vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    actions: {
      sendToken: vi.fn(),
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

describe('useSendToken', () => {
  beforeEach(() => {
    (sdk.actions.sendToken as Mock).mockResolvedValue(sendTokenMock);
    vi.clearAllMocks();
  });

  it('should return sendToken and sendTokenAsync functions', () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.sendToken).toBe('function');
    expect(typeof result.current.sendTokenAsync).toBe('function');
  });

  it('should call sdk.actions.sendToken when sendToken is executed', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should call sdk.actions.sendToken when sendTokenAsync is executed', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      await result.current.sendTokenAsync(params);
    });

    expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
  });

  it('should pass token parameter correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should pass amount parameter correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      amount: '1000000',
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should pass recipientAddress parameter correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should pass recipientFid parameter correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      recipientFid: 12345,
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should pass all parameters correctly when provided', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
      recipientFid: 12345,
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should handle empty parameters object', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {};

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should pass different token formats correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    // Test with ETH native token on Ethereum mainnet
    const ethParams = {
      token: 'eip155:1/native',
      amount: '1000000000000000000', // 1 ETH in wei
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(ethParams);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(ethParams);
    });
  });

  it('should pass polygon token formats correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    // Test with Polygon tokens
    const polygonParams = {
      token: 'eip155:137/erc20:0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
      amount: '1000000', // 1 USDC
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(polygonParams);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(polygonParams);
    });
  });

  it('should return the send token result on success', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    let response;
    await act(async () => {
      response = await result.current.sendTokenAsync(params);
    });

    expect(response).toBe(sendTokenMock);
  });

  it('should handle errors when sendToken fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    (sdk.actions.sendToken as Mock).mockRejectedValue(
      new Error('Send token failed'),
    );

    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    consoleSpy.mockRestore();
  });

  it('should handle mutation states correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    act(() => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should handle network error correctly', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    (sdk.actions.sendToken as Mock).mockRejectedValue(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      try {
        await result.current.sendTokenAsync(params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });

    consoleSpy.mockRestore();
  });

  it('should handle large amount values', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:1/erc20:0xA0b86a33E6441D5D56b5FF87d65f2B8e9F90C54c',
      amount: '999999999999999999999999', // Very large amount
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should handle decimal amount values correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1500000', // 1.5 USDC (with 6 decimals)
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should reset mutation state on multiple calls', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params1 = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    const params2 = {
      token: 'eip155:10/native',
      amount: '2000000',
      recipientFid: 54321,
    };

    // First call
    await act(async () => {
      result.current.sendToken(params1);
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
      result.current.sendToken(params2);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params2);
    });
  });

  it('should handle sending to recipient via FID only', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientFid: 12345,
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should handle sending to recipient via address only', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should handle sending with both recipient address and FID', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
      recipientFid: 12345,
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should handle zero FID value', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000',
      recipientFid: 0,
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should handle very small amount values', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    const params = {
      token: 'eip155:1/native',
      amount: '1', // 1 wei
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(params);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(params);
    });
  });

  it('should handle different chain IDs correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    // Test with Arbitrum
    const arbitrumParams = {
      token: 'eip155:42161/erc20:0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
      amount: '1000000',
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(arbitrumParams);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(arbitrumParams);
    });
  });

  it('should handle Optimism token formats correctly', async () => {
    const { result } = renderHook(() => useSendToken(), {
      wrapper: createWrapper(),
    });

    // Test with Optimism tokens
    const optimismParams = {
      token: 'eip155:10/erc20:0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC on Optimism
      amount: '5000000', // 5 USDC
      recipientAddress: '0x1234567890123456789012345678901234567890',
    };

    await act(async () => {
      result.current.sendToken(optimismParams);
    });

    await waitFor(() => {
      expect(sdk.actions.sendToken).toHaveBeenCalledWith(optimismParams);
    });
  });
});
