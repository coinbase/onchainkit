import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FundSwapUnit } from '../types';
import { useResetFundSwapInputs } from './useResetFundSwapInputs';

describe('useResetFundSwapInputs', () => {
  const mockFromTokenResponse = {
    refetch: vi.fn().mockResolvedValue(undefined),
  };
  const mockFromUSDCTokenResponse = {
    refetch: vi.fn().mockResolvedValue(undefined),
  };
  const mockToTokenResponse = { refetch: vi.fn().mockResolvedValue(undefined) };
  const mockFromETH: FundSwapUnit = {
    balance: '100',
    balanceResponse: mockFromTokenResponse,
    amount: '50',
    setAmount: vi.fn(),
    setAmountUSD: vi.fn(),
    token: undefined,
    loading: false,
    setLoading: vi.fn(),
    error: undefined,
  };
  const mockFromUSDC: FundSwapUnit = {
    balance: '100',
    balanceResponse: mockFromUSDCTokenResponse,
    amount: '50',
    setAmount: vi.fn(),
    setAmountUSD: vi.fn(),
    token: undefined,
    loading: false,
    setLoading: vi.fn(),
    error: undefined,
  };
  const mockTo: FundSwapUnit = {
    balance: '200',
    balanceResponse: mockToTokenResponse,
    amount: '75',
    setAmount: vi.fn(),
    setAmountUSD: vi.fn(),
    token: undefined,
    loading: false,
    setLoading: vi.fn(),
    error: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() =>
      useResetFundSwapInputs({
        fromETH: mockFromETH,
        fromUSDC: mockFromUSDC,
        to: mockTo,
      }),
    );
    expect(typeof result.current).toBe('function');
  });

  it('should call refetch on responses and set amounts to empty strings when executed', async () => {
    const { result } = renderHook(() =>
      useResetFundSwapInputs({
        fromETH: mockFromETH,
        fromUSDC: mockFromUSDC,
        to: mockTo,
      }),
    );
    await act(async () => {
      await result.current();
    });
    expect(mockFromTokenResponse.refetch).toHaveBeenCalledTimes(1);
    expect(mockToTokenResponse.refetch).toHaveBeenCalledTimes(1);
    expect(mockFromETH.setAmount).toHaveBeenCalledWith('');
    expect(mockFromETH.setAmountUSD).toHaveBeenCalledWith('');
    expect(mockTo.setAmount).toHaveBeenCalledWith('');
    expect(mockTo.setAmountUSD).toHaveBeenCalledWith('');
  });

  it("should not create a new function reference if from and to haven't changed", () => {
    const { result, rerender } = renderHook(() =>
      useResetFundSwapInputs({
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
        useResetFundSwapInputs({
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
    };
    const newMockFromUSDC = {
      ...mockFromUSDC,
      balanceResponse: { refetch: vi.fn().mockResolvedValue(undefined) },
    };
    rerender({
      fromETH: newMockFromETH,
      fromUSDC: newMockFromUSDC,
      to: mockTo,
    });
    expect(result.current).not.toBe(firstRender);
  });

  it('should handle null responses gracefully', async () => {
    const mockFromWithNullResponse = { ...mockFromETH, balanceResponse: null };
    const mockFromUSDCWithNullResponse = {
      ...mockFromUSDC,
      balanceResponse: null,
    };
    const mockToWithNullResponse = { ...mockTo, balanceResponse: null };
    const { result } = renderHook(() =>
      useResetFundSwapInputs({
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
