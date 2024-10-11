import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePreferredColorScheme } from './usePreferredColorScheme';

describe('usePreferredColorScheme', () => {
  let _matchMedia: ReturnType<typeof vi.spyOn>;
  let mockMediaQueryList: MediaQueryList;

  beforeEach(() => {
    mockMediaQueryList = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    _matchMedia = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation(() => mockMediaQueryList);
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

  it('should update from light to dark when system preference changes', () => {
    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('light');

    act(() => {
      mockMediaQueryList.matches = true;
      mockMediaQueryList.addEventListener.mock.calls[0][1]({
        matches: true,
      } as MediaQueryListEvent);
    });

    expect(result.current).toBe('dark');
  });

  it('should update from dark to light when system preference changes', () => {
    mockMediaQueryList.matches = true;
    const { result } = renderHook(() => usePreferredColorScheme());
    expect(result.current).toBe('dark');

    act(() => {
      mockMediaQueryList.matches = false;
      mockMediaQueryList.addEventListener.mock.calls[0][1]({
        matches: false,
      } as MediaQueryListEvent);
    });

    expect(result.current).toBe('light');
  });

  it('should add event listener on mount', () => {
    renderHook(() => usePreferredColorScheme());
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => usePreferredColorScheme());
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
