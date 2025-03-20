// @ts-nocheck - more involved changes required
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useBreakpoints } from './useBreakpoints';

const createMatchMediaMock = (query: string) => ({
  matches: query === '(min-width: 769px) and (max-width: 1023px)',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
});

describe('useBreakpoints', () => {
  it('should set the breakpoint based on the window size', () => {
    (window.matchMedia as jest.Mock) = createMatchMediaMock;

    const { result } = renderHook(() => useBreakpoints());

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('lg');
  });

  it('should update the breakpoint on resize', () => {
    (window.matchMedia as jest.Mock) = createMatchMediaMock;

    const { result } = renderHook(() => useBreakpoints());

    (window.matchMedia as jest.Mock) = (query: string) =>
      ({
        matches: query === '(max-width: 640px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList;

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('sm');
  });

  it('should return md when no breakpoints match', () => {
    (window.matchMedia as jest.Mock) = (_query: string) =>
      ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList;

    const { result } = renderHook(() => useBreakpoints());

    expect(result.current).toBe('md');
  });
});
