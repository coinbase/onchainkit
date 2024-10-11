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
import { usePreferredColorScheme } from './internal/hooks/usePreferredColorScheme';
import type { UseThemeReact } from './types';
import { useOnchainKit } from './useOnchainKit';
import { useTheme } from './useTheme';

vi.mock('./useOnchainKit');
vi.mock('./internal/hooks/usePreferredColorScheme');

describe('useTheme', () => {
  let consoleLogSpy: Mock;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockUseOnchainKit = (theme?: string, mode?: string) => {
    (useOnchainKit as Mock).mockReturnValue({
      appearance: { theme, mode },
    });
  };

  const mockUsePreferredColorScheme = (preferredMode: 'light' | 'dark') => {
    (usePreferredColorScheme as Mock).mockReturnValue(preferredMode);
  };

  it.each([
    ['cyberpunk', 'auto', 'light', 'cyberpunk'],
    ['base', 'dark', 'dark', 'base'],
    ['minimal', 'light', 'light', 'minimal'],
  ] as const)(
    'should return %s theme when set, regardless of mode or system preference',
    (theme, mode, preferredMode, expected) => {
      mockUseOnchainKit(theme, mode);
      mockUsePreferredColorScheme(preferredMode);
      const { result } = renderHook(() => useTheme());
      expect(result.current).toBe(expected);
    },
  );

  it.each([
    ['default', 'auto', 'light', 'default-light'],
    ['default', 'auto', 'dark', 'default-dark'],
    ['default', 'light', 'dark', 'default-light'],
    ['default', 'dark', 'light', 'default-dark'],
    ['custom', 'auto', 'light', 'custom-light'],
    ['custom', 'auto', 'dark', 'custom-dark'],
    ['custom', 'light', 'dark', 'custom-light'],
    ['custom', 'dark', 'light', 'custom-dark'],
  ] as const)(
    'should return %s when theme is %s, mode is %s, and preferred mode is %s',
    (theme, mode, preferredMode, expected) => {
      mockUseOnchainKit(theme, mode);
      mockUsePreferredColorScheme(preferredMode);
      const { result } = renderHook(() => useTheme());
      expect(result.current).toBe(expected);
    },
  );

  it.each([
    ['default', undefined, 'light', 'default-light'],
    ['default', undefined, 'dark', 'default-dark'],
    ['custom', undefined, 'light', 'custom-light'],
    ['custom', undefined, 'dark', 'custom-dark'],
  ] as const)(
    'should fallback to preferred mode when theme is %s and mode is undefined',
    (theme, mode, preferredMode, expected) => {
      mockUseOnchainKit(theme, mode);
      mockUsePreferredColorScheme(preferredMode);
      const { result } = renderHook(() => useTheme());
      expect(result.current).toBe(expected);
    },
  );

  it('should handle undefined appearance gracefully', () => {
    (useOnchainKit as Mock).mockReturnValue({});
    mockUsePreferredColorScheme('light');
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('undefined-light');
  });

  it('should log theme, mode, and preferred mode', () => {
    mockUseOnchainKit('default', 'auto');
    mockUsePreferredColorScheme('light');
    renderHook(() => useTheme());
    expect(consoleLogSpy).toHaveBeenCalledWith('PreferredMode: ', 'light');
    expect(consoleLogSpy).toHaveBeenCalledWith('Theme: ', 'default');
    expect(consoleLogSpy).toHaveBeenCalledWith('Mode: ', 'auto');
  });

  it('should handle invalid mode gracefully', () => {
    mockUseOnchainKit('default', 'invalid' as any);
    mockUsePreferredColorScheme('light');
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('default-light');
  });

  it('should handle all possible return types of UseThemeReact', () => {
    const allThemes: UseThemeReact[] = [
      'cyberpunk',
      'base',
      'minimal',
      'default-light',
      'default-dark',
      'custom-light',
      'custom-dark',
    ];

    allThemes.forEach((theme) => {
      if (theme === 'cyberpunk' || theme === 'base' || theme === 'minimal') {
        mockUseOnchainKit(theme, 'auto');
      } else {
        const [baseTheme, mode] = theme.split('-');
        mockUseOnchainKit(baseTheme, mode as 'light' | 'dark');
      }
      mockUsePreferredColorScheme(theme.endsWith('dark') ? 'dark' : 'light');
      const { result } = renderHook(() => useTheme());
      expect(result.current).toBe(theme);
    });
  });
});
