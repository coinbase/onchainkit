import type { UseThemeReact } from './types';
import { useOnchainKit } from './useOnchainKit';
import { usePreferredColorScheme } from './internal/hooks/usePreferredColorScheme';

export function useTheme(): UseThemeReact {
  const preferredMode = usePreferredColorScheme();
  const { appearance } = useOnchainKit();
  const { theme, mode } = appearance || {};  

  if (theme === 'cyberpunk' || theme === 'base' || theme === 'minimal') {
    return theme;
  }

  // If the theme doesn't support light/dark variants, return it as is
  const currentMode = !mode || mode === 'auto' ? preferredMode : mode;
  
  return `${theme}-${currentMode}` as UseThemeReact;
}
