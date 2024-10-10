import { renderHook } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useOnchainKit } from './useOnchainKit';
import { useTheme } from './useTheme';

vi.mock('./useOnchainKit');

describe('useTheme', () => {
  let matchMediaSpy: Mock;
  let addEventListenerSpy: Mock;
  let removeEventListenerSpy: Mock;

  beforeEach(() => {
    addEventListenerSpy = vi.fn();
    removeEventListenerSpy = vi.fn();
    matchMediaSpy = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaSpy,
    });
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockUseOnchainKit = (theme?: string, mode?: string) => {
    (useOnchainKit as Mock).mockReturnValue({
      appearance: { theme, mode },
    });
  };

  const setPrefersDarkMode = (prefersDarkMode: boolean) => {
    matchMediaSpy.mockReturnValue({
      matches: prefersDarkMode,
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
    });
  };

  it('should return default-light when no theme or mode is set and system prefers light', () => {
    mockUseOnchainKit();
    setPrefersDarkMode(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('default-light');
  });

  it('should return default-dark when no theme or mode is set and system prefers dark', () => {
    mockUseOnchainKit();
    setPrefersDarkMode(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('default-dark');
  });

  it('should return default-light when mode is light, regardless of system preference', () => {
    mockUseOnchainKit(undefined, 'light');
    setPrefersDarkMode(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('default-light');
  });

  it('should return default-dark when mode is dark, regardless of system preference', () => {
    mockUseOnchainKit(undefined, 'dark');
    setPrefersDarkMode(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('default-dark');
  });

  it('should return cyberpunk theme when set, regardless of mode or system preference', () => {
    mockUseOnchainKit('cyberpunk', 'auto');
    setPrefersDarkMode(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('cyberpunk');
  });

  it('should return base theme when set, regardless of mode or system preference', () => {
    mockUseOnchainKit('base', 'dark');
    setPrefersDarkMode(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('base');
  });

  it('should return minimal theme when set, regardless of mode or system preference', () => {
    mockUseOnchainKit('minimal', 'light');
    setPrefersDarkMode(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('minimal');
  });

  it('should return default-light when theme is default, mode is auto, and system prefers light', () => {
    mockUseOnchainKit('default', 'auto');
    setPrefersDarkMode(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('default-light');
  });

  it('should return default-dark when theme is default, mode is auto, and system prefers dark', () => {
    mockUseOnchainKit('default', 'auto');
    setPrefersDarkMode(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('default-dark');
  });

  it('should update theme when system preference changes', () => {
    mockUseOnchainKit('default', 'auto');
    setPrefersDarkMode(false);
    const { result, rerender } = renderHook(() => useTheme());
    expect(result.current).toBe('default-light');
    setPrefersDarkMode(true);
    addEventListenerSpy.mock.calls[0][1]({ matches: true });
    rerender();
    expect(result.current).toBe('default-light');
  });

  it('should fallback to auto behavior when theme is specified but mode is undefined', () => {
    mockUseOnchainKit('default', undefined);
    setPrefersDarkMode(false);
    const { result, rerender } = renderHook(() => useTheme());
    expect(result.current).toBe('default-light');
    setPrefersDarkMode(true);
    addEventListenerSpy.mock.calls[0][1]({ matches: true });
    rerender();
    expect(result.current).toBe('default-light');
  });

  it('should fallback to auto behavior for non-default themes when mode is undefined', () => {
    mockUseOnchainKit('cyberpunk', undefined);
    setPrefersDarkMode(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('cyberpunk');
    mockUseOnchainKit('base', undefined);
    const { result: result2 } = renderHook(() => useTheme());
    expect(result2.current).toBe('base');
    mockUseOnchainKit('minimal', undefined);
    const { result: result3 } = renderHook(() => useTheme());
    expect(result3.current).toBe('minimal');
  });

  it('should handle undefined appearance gracefully', () => {
    (useOnchainKit as Mock).mockReturnValue({});
    setPrefersDarkMode(false);
    const { result: resultLight } = renderHook(() => useTheme());
    expect(resultLight.current).toBe('default-light');
    setPrefersDarkMode(true);
    const { result: resultDark } = renderHook(() => useTheme());
    expect(resultDark.current).toBe('default-dark');
  });
});
