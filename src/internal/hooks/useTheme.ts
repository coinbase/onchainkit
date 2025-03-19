import type { UseThemeReact } from '../../core/types';
import { useOnchainKit } from '../../useOnchainKit';
import { usePreferredColorScheme } from './usePreferredColorScheme';

export function useTheme(): UseThemeReact {
  const preferredMode = usePreferredColorScheme();
  const { config: { appearance } = {} } = useOnchainKit();
  const { theme = 'default', mode = 'auto' } = appearance || {};

  if (theme === 'cyberpunk' || theme === 'hacker') {
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
