import { useMemo } from 'react';
import type { UseThemeReact } from '../../core/types';
import { useOnchainKit } from '../../useOnchainKit';
import { usePreferredColorScheme } from './usePreferredColorScheme';

const ALLOWED_MODES = ['light', 'dark'];

export function useTheme(): UseThemeReact {
  const preferredMode = usePreferredColorScheme();
  const { config: { appearance } = {} } = useOnchainKit();
  const theme = appearance?.theme ?? 'default';

  const mode = useMemo(() => {
    if (!appearance?.mode || !ALLOWED_MODES.includes(appearance.mode)) {
      return preferredMode;
    }

    return appearance.mode;
  }, [appearance?.mode, preferredMode]);

  const result =
    theme === 'cyberpunk' || theme === 'hacker' ? theme : `${theme}-${mode}`;

  return result;
}
