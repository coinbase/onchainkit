import { useMemo } from 'react';
import { background } from '../../../styles/theme';
import { useTheme } from '../../../useTheme';
import { linearGradientStops } from './gradientConstants';
import { GRADIENT_COLOR } from './gradientConstants';

export function useLinearGradient() {
  const theme = useTheme();

  const linearColors = useMemo(() => {
    const stop = linearGradientStops[GRADIENT_COLOR];
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
