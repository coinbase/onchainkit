import type { UseThemeReact } from '../../core/types';
import { useOnchainKit } from '../../useOnchainKit';
import { usePreferredColorScheme } from './usePreferredColorScheme';

const VALID_MODES = new Set<unknown>(['light', 'dark']);

export function useTheme(): UseThemeReact {
  const preferredMode = usePreferredColorScheme();
  const { config: { appearance } = {} } = useOnchainKit();
  const theme = appearance?.theme ?? 'default';
  const mode =
    !appearance?.mode || !VALID_MODES.has(appearance.mode)
      ? preferredMode
      : appearance.mode;

  return theme === 'cyberpunk' || theme === 'hacker'
    ? theme
    : `${theme}-${mode}`;
}
