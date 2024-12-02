// import { MiamiThemeColorPreference } from 'cb-wallet-data/stores/ThemeColors/themeColorConfigs';

export const GRADIENT_START_COORDINATES = { x: 0, y: 0 };
export const GRADIENT_END_COORDINATES = { x: 1, y: 0 };
export const GRADIENT_END_STYLE = { borderRadius: 32 };

type LinearGradient = { startColor: string; endColor: string };

export const linearGradientStops: Record<string, LinearGradient> = {
  blue: {
    startColor: '#266EFF',
    endColor: '#45E1E5',
  },
  orange: {
    startColor: '#E43A48',
    endColor: '#FF9533',
  },
  yellow: {
    startColor: '#FF9533',
    endColor: '#FFE835',
  },
  purple: {
    startColor: '#B139FF',
    endColor: '#C872FF',
  },
  pink: {
    startColor: '#EE5A67',
    endColor: '#CE46BD',
  },
  green: {
    startColor: '#7FD057',
    endColor: '#45E1E5',
  },
};
