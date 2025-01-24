import type { UseThemeReact } from '@/core/types';
import { useOnchainKit } from '@/useOnchainKit';
import { renderHook } from '@testing-library/react';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { usePreferredColorScheme } from './usePreferredColorScheme';
import { useTheme } from './useTheme';

vi.mock('@/useOnchainKit');
vi.mock('./usePreferredColorScheme');

describe('useTheme', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockUseOnchainKit = (theme?: string, mode?: string) => {
    (useOnchainKit as Mock).mockReturnValue({
      config: {
        appearance: { theme, mode },
      },
    });
  };

  const mockUsePreferredColorScheme = (preferredMode: 'light' | 'dark') => {
    (usePreferredColorScheme as Mock).mockReturnValue(preferredMode);
  };

  it.each([
    ['cyberpunk', 'auto', 'light', 'cyberpunk'],
    ['base', 'dark', 'dark', 'base'],
    ['hacker', 'light', 'light', 'hacker'],
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
    expect(result.current).toBe('default-light');
  });

  it('should handle invalid mode gracefully', () => {
    mockUseOnchainKit('default', 'invalid' as 'light' | 'dark' | 'auto');
    mockUsePreferredColorScheme('light');
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('default-light');
  });

  it('should handle all possible return types of UseThemeReact', () => {
    const allThemes: UseThemeReact[] = [
      'cyberpunk',
      'base',
      'hacker',
      'default-light',
      'default-dark',
    ];

    for (const theme of allThemes) {
      if (theme === 'cyberpunk' || theme === 'base' || theme === 'hacker') {
        mockUseOnchainKit(theme, 'auto');
      } else {
        const [baseTheme, mode] = theme.split('-');
        mockUseOnchainKit(baseTheme, mode as 'light' | 'dark');
      }
      mockUsePreferredColorScheme(theme.endsWith('dark') ? 'dark' : 'light');
      const { result } = renderHook(() => useTheme());
      expect(result.current).toBe(theme);
    }
  });
});
