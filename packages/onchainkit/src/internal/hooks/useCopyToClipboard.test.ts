import { renderHook, act } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { useCopyToClipboard } from './useCopyToClipboard';

const mockClipboard = {
  writeText: vi.fn(),
};

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      configurable: true,
    });
    mockClipboard.writeText.mockReset();
    mockClipboard.writeText.mockResolvedValue(undefined);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should call navigator.clipboard.writeText with the provided text', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current('test text');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
  });

  it('should call onSuccess callback when copy is successful', async () => {
    const onSuccess = vi.fn();
    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useCopyToClipboard({ onSuccess }));

    await act(async () => {
      await result.current('test text');
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it('should call onError callback when copy fails', async () => {
    const onError = vi.fn();
    const testError = new Error('Clipboard error');
    mockClipboard.writeText.mockRejectedValueOnce(testError);

    const { result } = renderHook(() => useCopyToClipboard({ onError }));

    await act(async () => {
      await result.current('test text');
    });

    expect(onError).toHaveBeenCalledWith(testError);
  });

  it('should call onReset after resetDelay time', async () => {
    const onReset = vi.fn();
    const resetDelay = 2000;
    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useCopyToClipboard({ onReset, resetDelay }),
    );

    await act(async () => {
      await result.current('test text');
    });

    expect(onReset).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(resetDelay);
    });

    expect(onReset).toHaveBeenCalled();
  });

  it('should clear any existing timeout when called again', async () => {
    const onReset = vi.fn();
    const resetDelay = 2000;
    mockClipboard.writeText.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useCopyToClipboard({ onReset, resetDelay }),
    );

    await act(async () => {
      await result.current('first text');
    });

    // Advance time but not enough to trigger reset
    await act(async () => {
      vi.advanceTimersByTime(resetDelay / 2);
    });

    await act(async () => {
      await result.current('second text');
    });

    // Advance time to what would trigger the first reset if it wasn't cleared
    await act(async () => {
      vi.advanceTimersByTime(resetDelay / 2);
    });

    expect(onReset).not.toHaveBeenCalled();

    // Now advance enough to trigger the second reset
    await act(async () => {
      vi.advanceTimersByTime(resetDelay / 2);
    });

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('should clean up timeout on unmount', async () => {
    const onReset = vi.fn();
    const resetDelay = 2000;
    mockClipboard.writeText.mockResolvedValueOnce(undefined);

    const { result, unmount } = renderHook(() =>
      useCopyToClipboard({ onReset, resetDelay }),
    );

    await act(async () => {
      await result.current('test text');
    });

    unmount();

    // Advance time past when the reset would happen
    await act(async () => {
      vi.advanceTimersByTime(resetDelay + 100);
    });

    expect(onReset).not.toHaveBeenCalled();
  });
});
