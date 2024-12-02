import { useMemo } from 'react';
// import { MiamiThemeColorPreference } from 'cb-wallet-data/stores/ThemeColors/themeColorConfigs';
// import { PartialPaletteConfig, usePaletteConfig, useSpectrum } from '@cbhq/cds-common';

// import { useThemeColorPreference } from ':rn/app/hooks/useThemeColorPreference';
import { useTheme } from '../../../useTheme';
import { background } from '../../../styles/theme';

import { linearGradientStops } from './gradientConstants';

export function useLinearGradient() {
  const theme = useTheme();
  // const { background, foreground } = usePaletteConfig();
  // const spectrum = useSpectrum();
  // const preference = useThemeColorPreference();

  const linearColors = useMemo(() => {
    // handle the case where someone is coming from teal color, which is now removed.
    const stop = linearGradientStops.blue;
    return [stop.startColor, stop.endColor];
  }, []);

  const gradientPalette = useMemo(
    () => ({
      primary: theme === 'dark' ? background.default : background.inverse,
      background: 'blue-40',
    }),
    [theme],
  );

  return useMemo(
    () => ({
      linearColors,
      gradientPalette,
    }),
    [gradientPalette, linearColors],
  );
}
