import type { UseThemeReact } from '../../core/types';
import { useOnchainKit } from '../../useOnchainKit';
import { usePreferredColorScheme } from './usePreferredColorScheme';

const VALID_MODES = new Set<unknown>(['light', 'dark']);

function baseUseTheme({
  theme,
  mode,
  preferredMode,
}: {
  theme?: string | null;
  mode?: string | null;
  preferredMode?: string | null;
} = {}): UseThemeReact {
  const finalMode = !mode || !VALID_MODES.has(mode) ? preferredMode : mode;
  return theme === 'cyberpunk' || theme === 'hacker'
    ? theme
    : `${theme}-${finalMode}`;
}

export function useTheme() {
  const preferredMode = usePreferredColorScheme();
  const { config: { appearance } = {} } = useOnchainKit();
  const theme = appearance?.theme ?? 'default';

  return baseUseTheme({ theme, mode: appearance?.mode ?? '', preferredMode });
}

export function useThemeRoot({
  theme,
  mode,
}: {
  theme?: string | null;
  mode?: string | null;
}) {
  const preferredMode = usePreferredColorScheme();
  return baseUseTheme({ theme, mode, preferredMode });
}
