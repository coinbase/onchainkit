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

export const presetGradients = {
  default: [
    ['#0F27FF', '39.06%'],
    ['#6100FF', '76.56%'],
    ['#201F1D', '100%'],
  ],
  red: [
    ['#EE2634', '39.06%'],
    ['#6100FF', '76.56%'],
    ['#201F1D', '100%'],
  ],
  magenta: [
    ['#CF00F1', '36.46%'],
    ['#7900F1', '68.58%'],
    ['#201F1D', '100%'],
  ],
  blue: [
    ['#0F6FFF', '39.06%'],
    ['#0F27FF', '76.56%'],
    ['#201F1D', '100%'],
  ],
  cyan: [
    ['#007cd6', '39.06%'],
    ['#6100FF', '76.56%'],
    ['#201F1D', '100%'],
  ],
  green: [
    ['#008A59', '39.06%'],
    ['#0F6FFF', '76.56%'],
    ['#201F1D', '100%'],
  ],
  yellow: [
    ['#A525FC', '39.06%'],
    ['#0F27FF', '76.56%'],
    ['#201F1D', '100%'],
  ],
};
