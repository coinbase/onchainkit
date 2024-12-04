export const QR_CODE_SIZE = 237;
export const QR_LOGO_SIZE = 50;
export const QR_LOGO_RADIUS = 10;
export const QR_LOGO_BACKGROUND_COLOR = 'white';
export const GRADIENT_START_COORDINATES = { x: 0, y: 0 };
export const GRADIENT_END_COORDINATES = { x: 1, y: 0 };
export const GRADIENT_END_STYLE = { borderRadius: 32 };
export const GRADIENT_COLOR = 'blue'

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
