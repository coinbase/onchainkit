import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useThrottle } from './useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('executes callback immediately on first call', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    const throttled = result.current;
    throttled('test');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');
  });

  it('ignores calls within throttle period', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    result.current('first');
    result.current('second');
    result.current('third');

    expect(callback).toHaveBeenCalledWith('first');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('schedules execution after throttle period', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    // First call - executes immediately
    result.current();
    expect(callback).toHaveBeenCalledTimes(1);

    // Second call - gets scheduled
    result.current();
    expect(callback).toHaveBeenCalledTimes(1);

    // After delay, scheduled call executes
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('preserves callback arguments', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    result.current('test', 123);
    expect(callback).toHaveBeenCalledWith('test', 123);
  });

  it('uses latest callback reference', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { result, rerender } = renderHook(({ cb }) => useThrottle(cb, 1000), {
      initialProps: { cb: callback1 },
    });

    result.current();
    expect(callback1).toHaveBeenCalled();

    rerender({ cb: callback2 });
    vi.advanceTimersByTime(1000);
    result.current();
    expect(callback2).toHaveBeenCalled();
  });
});
