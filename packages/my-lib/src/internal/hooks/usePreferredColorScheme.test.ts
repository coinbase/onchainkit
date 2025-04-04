import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePreferredColorScheme } from './usePreferredColorScheme';

describe('usePreferredColorScheme', () => {
  type MockMediaQueryList = {
    matches: boolean;
    media: string;
    onchange: null;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
    addListener: ReturnType<typeof vi.fn>;
    removeListener: ReturnType<typeof vi.fn>;
    dispatchEvent: ReturnType<typeof vi.fn>;
  };

  let mockMediaQueryList: MockMediaQueryList;

  beforeEach(() => {
    mockMediaQueryList = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    if (typeof window !== 'undefined') {
      vi.spyOn(window, 'matchMedia').mockImplementation(
        () => mockMediaQueryList as unknown as MediaQueryList,
      );
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return "light" by default', () => {
    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('light');
  });

  it('should return "dark" when system preference is dark', () => {
    mockMediaQueryList.matches = true;
    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('dark');
  });

  it('should update color scheme when system preference changes', () => {
    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('light');

    act(() => {
      mockMediaQueryList.matches = true;
      const changeHandler =
        mockMediaQueryList.addEventListener.mock.calls[0][1];
      changeHandler({ matches: true } as MediaQueryListEvent);
    });
    expect(result.current).toBe('dark');

    act(() => {
      mockMediaQueryList.matches = false;
      const changeHandler =
        mockMediaQueryList.addEventListener.mock.calls[0][1];
      changeHandler({ matches: false } as MediaQueryListEvent);
    });
    expect(result.current).toBe('light');
  });

  it('should add event listener on mount and remove on unmount', () => {
    const { unmount } = renderHook(() => usePreferredColorScheme());
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );

    unmount();
    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('should handle multiple renders without adding multiple listeners', () => {
    const { rerender } = renderHook(() => usePreferredColorScheme());
    rerender();
    rerender();
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledTimes(1);
  });
});
