import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useResetInputs } from './useResetInputs';

describe('useResetInputs', () => {
  const mockFromTokenResponse = {
    refetch: vi.fn().mockResolvedValue(undefined),
  };
  const mockToTokenResponse = { refetch: vi.fn().mockResolvedValue(undefined) };
  const mockFrom = {
    balance: '100',
    amount: '50',
    setAmount: vi.fn(),
    token: { symbol: 'TOKEN1' },
    setToken: vi.fn(),
    loading: false,
    setLoading: vi.fn(),
    error: null,
    refetch: vi.fn().mockImplementation(async () => {
      await mockFromTokenResponse.refetch();
    }),
  };
  const mockTo = {
    balance: '200',
    amount: '75',
    setAmount: vi.fn(),
    token: { symbol: 'TOKEN2' },
    setToken: vi.fn(),
    loading: false,
    setLoading: vi.fn(),
    error: null,
    refetch: vi.fn().mockImplementation(async () => {
      await mockToTokenResponse.refetch();
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const { result } = renderHook(() =>
      useResetInputs({ from: mockFrom, to: mockTo }),
    );
    expect(typeof result.current).toBe('function');
  });

  it('should call refetch and setAmount on both from and to when executed', async () => {
    const { result } = renderHook(() =>
      useResetInputs({ from: mockFrom, to: mockTo }),
    );
    await act(async () => {
      await result.current();
    });
    expect(mockFrom.refetch).toHaveBeenCalledTimes(1);
    expect(mockTo.refetch).toHaveBeenCalledTimes(1);
    expect(mockFrom.setAmount).toHaveBeenCalledWith('');
    expect(mockTo.setAmount).toHaveBeenCalledWith('');
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
      refetch: vi.fn().mockResolvedValue(undefined),
    };
    rerender({ from: newMockFrom, to: mockTo });
    expect(result.current).not.toBe(firstRender);
  });

  it('should handle errors in refetch calls', async () => {
    const errorMockFrom = {
      refetch: vi.fn().mockRejectedValue(new Error('From refetch error')),
      setAmount: vi.fn(),
    };
    const errorMockTo = {
      refetch: vi.fn().mockRejectedValue(new Error('To refetch error')),
      setAmount: vi.fn(),
    };
    const { result } = renderHook(() =>
      useResetInputs({ from: errorMockFrom, to: errorMockTo }),
    );
    await act(async () => {
      await expect(result.current()).rejects.toThrow('From refetch error');
    });
    expect(errorMockFrom.refetch).toHaveBeenCalledTimes(1);
    expect(errorMockTo.refetch).toHaveBeenCalledTimes(1);
    expect(errorMockFrom.setAmount).toHaveBeenCalledWith('');
    expect(errorMockTo.setAmount).toHaveBeenCalledWith('');
  });
});
