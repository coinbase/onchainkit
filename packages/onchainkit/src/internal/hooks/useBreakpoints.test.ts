import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBreakpoints } from './useBreakpoints';

describe('useBreakpoints', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should set the breakpoint based on the window size', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query === '(min-width: 769px) and (max-width: 1023px)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          media: query,
          onchange: null,
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useBreakpoints());

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('lg');
  });

  it('should update the breakpoint on resize', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query === '(min-width: 769px) and (max-width: 1023px)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          media: query,
          onchange: null,
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useBreakpoints());

    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query === '(max-width: 640px)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          media: query,
          onchange: null,
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('sm');
  });

  it('should return md when no breakpoints match', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (_query: string) =>
        ({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          media: _query,
          onchange: null,
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    const { result } = renderHook(() => useBreakpoints());

    expect(result.current).toBe('md');
  });
});
