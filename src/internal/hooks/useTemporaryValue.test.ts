import { useTemporaryValue } from '@/internal/hooks/useTemporaryValue';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useTemporaryValue', () => {
  it('returns initial value', () => {
    const { result } = renderHook(() => useTemporaryValue('hello', 1000));
    expect(result.current[0]).toBe('hello');
  });

  it('updates value and resets after duration', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTemporaryValue('initial', 1000));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current[0]).toBe('initial');
  });

  it('does not reset if set to the initial value again', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTemporaryValue('unchanged', 1000));

    act(() => {
      result.current[1]('unchanged');
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current[0]).toBe('unchanged');
  });
});
