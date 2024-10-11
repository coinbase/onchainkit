import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePreferredColorScheme } from './usePreferredColorScheme';

describe('usePreferredColorScheme', () => {
  let matchMedia: ReturnType<typeof vi.spyOn<typeof window, 'matchMedia'>>;

  beforeEach(() => {
    matchMedia = vi.spyOn(window, 'matchMedia');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return "light" by default', () => {
    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    matchMedia.mockImplementation(() => mockMediaQueryList as MediaQueryList);

    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('light');
  });

  it('should return "dark" when system preference is dark', () => {
    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    matchMedia.mockImplementation(() => mockMediaQueryList as MediaQueryList);

    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('dark');
  });

  it('should update when system preference changes', async () => {
    let mockedMatches = false;
    let changeHandler: ((event: MediaQueryListEvent) => void) | undefined;

    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: mockedMatches,
      addEventListener: (
        event: string,
        handler: EventListenerOrEventListenerObject,
      ) => {
        if (event === 'change' && typeof handler === 'function') {
          changeHandler = handler;
        }
      },
      removeEventListener: vi.fn(),
    };

    matchMedia.mockImplementation(() => mockMediaQueryList as MediaQueryList);

    const { result, rerender } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('light');

    // Simulate preference change
    mockedMatches = true;
    mockMediaQueryList.matches = true;
    if (changeHandler) {
      changeHandler({ matches: true } as MediaQueryListEvent);
    }
    rerender();

    expect(result.current).toBe('dark');
  });

  it('should add event listener on mount', () => {
    const addEventListenerSpy = vi.fn();
    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: false,
      addEventListener: addEventListenerSpy,
      removeEventListener: vi.fn(),
    };

    matchMedia.mockImplementation(() => mockMediaQueryList as MediaQueryList);

    renderHook(() => usePreferredColorScheme());
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.fn();
    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerSpy,
    };

    matchMedia.mockImplementation(() => mockMediaQueryList as MediaQueryList);

    const { unmount } = renderHook(() => usePreferredColorScheme());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('should handle multiple renders without adding multiple listeners', () => {
    const addEventListenerSpy = vi.fn();
    const mockMediaQueryList: Partial<MediaQueryList> = {
      matches: false,
      addEventListener: addEventListenerSpy,
      removeEventListener: vi.fn(),
    };

    matchMedia.mockImplementation(() => mockMediaQueryList as MediaQueryList);

    const { rerender } = renderHook(() => usePreferredColorScheme());
    rerender();
    rerender();
    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
  });
});
