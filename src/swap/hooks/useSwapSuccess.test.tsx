import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SwapInput } from '../types';
import { useSwapSuccess } from './useSwapSuccess';

describe('useSwapSuccess', () => {
  it('should call refetch and setAmount for both from and to inputs', async () => {
    const mockFrom: SwapInput = {
      refetch: vi.fn().mockResolvedValue(undefined),
      setAmount: vi.fn(),
    };

    const mockTo: SwapInput = {
      refetch: vi.fn().mockResolvedValue(undefined),
      setAmount: vi.fn(),
    };

    const { result } = renderHook(() =>
      useSwapSuccess({ from: mockFrom, to: mockTo }),
    );

    await act(async () => {
      await result.current();
    });

    expect(mockFrom.refetch).toHaveBeenCalledTimes(1);
    expect(mockTo.refetch).toHaveBeenCalledTimes(1);
    expect(mockFrom.setAmount).toHaveBeenCalledWith('');
    expect(mockTo.setAmount).toHaveBeenCalledWith('');
  });

  it('should handle errors in refetch calls', async () => {
    const mockError = new Error('Refetch failed');
    const mockFrom: SwapInput = {
      refetch: vi.fn().mockRejectedValue(mockError),
      setAmount: vi.fn(),
    };

    const mockTo: SwapInput = {
      refetch: vi.fn().mockResolvedValue(undefined),
      setAmount: vi.fn(),
    };

    const { result } = renderHook(() =>
      useSwapSuccess({ from: mockFrom, to: mockTo }),
    );

    await act(async () => {
      await expect(result.current()).rejects.toThrow('Refetch failed');
    });

    expect(mockFrom.refetch).toHaveBeenCalledTimes(1);
    expect(mockTo.refetch).toHaveBeenCalledTimes(1);
    expect(mockFrom.setAmount).toHaveBeenCalledWith('');
    expect(mockTo.setAmount).toHaveBeenCalledWith('');
  });

  it('should memoize the returned function', () => {
    const mockFrom: SwapInput = {
      refetch: vi.fn().mockResolvedValue(undefined),
      setAmount: vi.fn(),
    };

    const mockTo: SwapInput = {
      refetch: vi.fn().mockResolvedValue(undefined),
      setAmount: vi.fn(),
    };

    const { result, rerender } = renderHook(() =>
      useSwapSuccess({ from: mockFrom, to: mockTo }),
    );

    const firstRender = result.current;
    rerender();
    const secondRender = result.current;

    expect(firstRender).toBe(secondRender);
  });
});
