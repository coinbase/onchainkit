import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should debounce the callback function', () => {
    const callback = vi.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    act(() => {
      debouncedFn('test');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should cancel previous debounce when called again before delay', () => {
    const callback = vi.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    act(() => {
      debouncedFn('first call');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      debouncedFn('second call');
    });

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second call');
  });

  it('should clean up timeout on unmount', () => {
    const callback = vi.fn();
    const delay = 500;

    const { result, unmount } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    act(() => {
      debouncedFn('test');
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should update callback reference when callback changes', () => {
    const initialCallback = vi.fn();
    const newCallback = vi.fn();
    const delay = 500;

    const { result, rerender } = renderHook(
      ({ callback }) => useDebounce(callback, delay),
      { initialProps: { callback: initialCallback } },
    );

    act(() => {
      result.current('test');
    });

    rerender({ callback: newCallback });

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(initialCallback).not.toHaveBeenCalled();
    expect(newCallback).toHaveBeenCalledTimes(1);
    expect(newCallback).toHaveBeenCalledWith('test');
  });

  it('should handle multiple parameters correctly', () => {
    const callback = vi.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    act(() => {
      debouncedFn('param1', 123, { test: true });
    });

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('param1', 123, { test: true });
  });
});
