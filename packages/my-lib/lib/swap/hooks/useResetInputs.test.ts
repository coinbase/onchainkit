import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FromTo, SwapUnit } from '../types';
import { useResetInputs } from './useResetInputs';

describe('useResetInputs', () => {
  const mockFromTokenResponse = {
    refetch: vi.fn().mockResolvedValue(undefined),
  };
  const mockToTokenResponse = { refetch: vi.fn().mockResolvedValue(undefined) };
  const mockFrom: SwapUnit = {
    balance: '100',
    balanceResponse: mockFromTokenResponse,
    amount: '50',
    setAmount: vi.fn(),
    setAmountUSD: vi.fn(),
    token: undefined,
    setToken: vi.fn(),
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
    setToken: vi.fn(),
    loading: false,
    setLoading: vi.fn(),
    error: undefined,
  } as unknown as SwapUnit;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() =>
      useResetInputs({ from: mockFrom, to: mockTo }),
    );
    expect(typeof result.current).toBe('function');
  });

  it('should call refetch on responses and set amounts to empty strings when executed', async () => {
    const { result } = renderHook(() =>
      useResetInputs({ from: mockFrom, to: mockTo }),
    );
    await act(async () => {
      await result.current();
    });
    expect(mockFromTokenResponse.refetch).toHaveBeenCalledTimes(1);
    expect(mockToTokenResponse.refetch).toHaveBeenCalledTimes(1);
    expect(mockFrom.setAmount).toHaveBeenCalledWith('');
    expect(mockFrom.setAmountUSD).toHaveBeenCalledWith('');
    expect(mockTo.setAmount).toHaveBeenCalledWith('');
    expect(mockTo.setAmountUSD).toHaveBeenCalledWith('');
  });

  it("should not create a new function reference if from and to haven't changed", () => {
    const { result, rerender } = renderHook(() =>
      useResetInputs({ from: mockFrom, to: mockTo }),
    );
    const firstRender = result.current;
    rerender();
    expect(result.current).toBe(firstRender);
  });

  it('should create a new function reference if from or to change', () => {
    const { result, rerender } = renderHook(
      ({ from, to }) => useResetInputs({ from, to }),
      { initialProps: { from: mockFrom, to: mockTo } },
    );
    const firstRender = result.current;
    const newMockFrom = {
      ...mockFrom,
      balanceResponse: { refetch: vi.fn().mockResolvedValue(undefined) },
    };
    rerender({ from: newMockFrom, to: mockTo } as unknown as FromTo);
    expect(result.current).not.toBe(firstRender);
  });

  it('should handle null responses gracefully', async () => {
    const mockFromWithNullResponse = { ...mockFrom, balanceResponse: null };
    const mockToWithNullResponse = { ...mockTo, balanceResponse: null };
    const { result } = renderHook(() =>
      useResetInputs({
        from: mockFromWithNullResponse,
        to: mockToWithNullResponse,
      } as unknown as FromTo),
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
