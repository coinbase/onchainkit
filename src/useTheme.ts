import { usePreferredColorScheme } from './internal/hooks/usePreferredColorScheme';
import type { UseThemeReact } from './types';
import { useOnchainKit } from './useOnchainKit';

export function useTheme(): UseThemeReact {
  const preferredMode = usePreferredColorScheme();
  const { appearance } = useOnchainKit();
  const { theme, mode } = appearance || {};

  if (theme === 'cyberpunk' || theme === 'base' || theme === 'minimal') {
    return theme;
  }

  switch (mode) {
    case 'auto':
      return `${theme}-${preferredMode}` as UseThemeReact;
    case 'dark':
      return `${theme}-dark` as UseThemeReact;
    case 'light':
      return `${theme}-light` as UseThemeReact;
    default:
      // If mode is not set or is an invalid value, fall back to preferredMode
      return `${theme}-${preferredMode}` as UseThemeReact;
  }
}
