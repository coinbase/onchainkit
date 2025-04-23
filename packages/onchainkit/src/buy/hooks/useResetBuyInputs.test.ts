import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SwapUnit } from '../../swap/types';
import { useResetBuyInputs } from './useResetBuyInputs';

describe('useResetBuyInputs', () => {
  const mockQueryResponse = {
    data: undefined,
    error: null,
    isError: false,
    isPending: true,
    isSuccess: false,
    status: 'pending',
  } as const;

  const mockFromTokenResponse = {
    ...mockQueryResponse,
    refetch: vi.fn().mockResolvedValue(undefined),
  };
  const mockFromETHTokenResponse = {
    ...mockQueryResponse,
    refetch: vi.fn().mockResolvedValue(undefined),
  };
  const mockFromUSDCTokenResponse = {
    ...mockQueryResponse,
    refetch: vi.fn().mockResolvedValue(undefined),
  };
  const mockToTokenResponse = {
    ...mockQueryResponse,
    refetch: vi.fn().mockResolvedValue(undefined),
  };
  const mockFrom: SwapUnit = {
    balance: '100',
    balanceResponse: mockFromTokenResponse,
    amount: '50',
    setAmount: vi.fn(),
    setAmountUSD: vi.fn(),
    token: undefined,
    loading: false,
    setLoading: vi.fn(),
    error: undefined,
  } as unknown as SwapUnit;
  const mockFromETH: SwapUnit = {
    balance: '100',
    balanceResponse: mockFromETHTokenResponse,
    amount: '50',
    setAmount: vi.fn(),
    setAmountUSD: vi.fn(),
    token: undefined,
    loading: false,
    setLoading: vi.fn(),
    error: undefined,
  } as unknown as SwapUnit;
  const mockFromUSDC: SwapUnit = {
    balance: '100',
    balanceResponse: mockFromUSDCTokenResponse,
    amount: '50',
    setAmount: vi.fn(),
    setAmountUSD: vi.fn(),
    token: undefined,
    loading: false,
    setLoading: vi.fn(),
    error: undefined,
  } as unknown as SwapUnit;
  const mockTo: SwapUnit = {
    balance: '200',
    balanceResponse: mockToTokenResponse,
    amount: '75',
    setAmount: vi.fn(),
    setAmountUSD: vi.fn(),
    token: undefined,
    loading: false,
    setLoading: vi.fn(),
    error: undefined,
  } as unknown as SwapUnit;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() =>
      useResetBuyInputs({
        fromETH: mockFromETH,
        fromUSDC: mockFromUSDC,
        from: mockFrom,
        to: mockTo,
      }),
    );
    expect(typeof result.current).toBe('function');
  });

  it('should call refetch on responses and set amounts to empty strings when executed', async () => {
    const { result } = renderHook(() =>
      useResetBuyInputs({
        fromETH: mockFromETH,
        fromUSDC: mockFromUSDC,
        from: mockFrom,
        to: mockTo,
      }),
    );
    await act(async () => {
      await result.current();
    });
    expect(mockFromETHTokenResponse.refetch).toHaveBeenCalledTimes(1);
    expect(mockToTokenResponse.refetch).toHaveBeenCalledTimes(1);
    expect(mockFromETH.setAmount).toHaveBeenCalledWith('');
    expect(mockFromETH.setAmountUSD).toHaveBeenCalledWith('');
    expect(mockTo.setAmount).toHaveBeenCalledWith('');
    expect(mockTo.setAmountUSD).toHaveBeenCalledWith('');
  });

  it("should not create a new function reference if from and to haven't changed", () => {
    const { result, rerender } = renderHook(() =>
      useResetBuyInputs({
        fromETH: mockFromETH,
        fromUSDC: mockFromUSDC,
        to: mockTo,
      }),
    );
    const firstRender = result.current;
    rerender();
    expect(result.current).toBe(firstRender);
  });

  it('should create a new function reference if from or to change', () => {
    const { result, rerender } = renderHook(
      ({ fromETH, fromUSDC, to }) =>
        useResetBuyInputs({
          fromETH,
          fromUSDC,
          to,
        }),
      {
        initialProps: {
          fromETH: mockFromETH,
          fromUSDC: mockFromUSDC,
          to: mockTo,
        },
      },
    );
    const firstRender = result.current;
    const newMockFromETH = {
      ...mockFromETH,
      balanceResponse: { refetch: vi.fn().mockResolvedValue(undefined) },
    } as unknown as SwapUnit;
    const newMockFromUSDC = {
      ...mockFromUSDC,
      balanceResponse: { refetch: vi.fn().mockResolvedValue(undefined) },
    } as unknown as SwapUnit;
    rerender({
      fromETH: newMockFromETH,
      fromUSDC: newMockFromUSDC,
      to: mockTo,
    });
    expect(result.current).not.toBe(firstRender);
  });

  it('should handle null responses gracefully', async () => {
    const mockFromWithNullResponse = {
      ...mockFromETH,
      balanceResponse: null,
    } as unknown as SwapUnit;
    const mockFromUSDCWithNullResponse = {
      ...mockFromUSDC,
      balanceResponse: null,
    } as unknown as SwapUnit;
    const mockToWithNullResponse = {
      ...mockTo,
      balanceResponse: null,
    } as unknown as SwapUnit;
    const { result } = renderHook(() =>
      useResetBuyInputs({
        fromETH: mockFromWithNullResponse,
        fromUSDC: mockFromUSDCWithNullResponse,
        to: mockToWithNullResponse,
      }),
    );
    await act(async () => {
      await result.current();
    });
    expect(mockFromWithNullResponse.setAmount).toHaveBeenCalledWith('');
    expect(mockFromWithNullResponse.setAmountUSD).toHaveBeenCalledWith('');
    expect(mockToWithNullResponse.setAmount).toHaveBeenCalledWith('');
    expect(mockToWithNullResponse.setAmountUSD).toHaveBeenCalledWith('');
  });
});
