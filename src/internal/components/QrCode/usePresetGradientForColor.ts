import { useMemo } from 'react';
import { presetGradients } from './gradientConstants';

function hexToHSL(hex: string) {
  const cleanHex = hex.replace(/^#/, '');
  const r = Number.parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = Number.parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = Number.parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function isInRange(x: number, min: number, max: number) {
  return x >= min && x <= max;
}

function useHueToGradient(hueDegree: number) {
  const gradient = useMemo(() => {
    const hueRanges = [
      { min: 0, max: 30, gradient: presetGradients.red },
      { min: 30, max: 85, gradient: presetGradients.yellow },
      { min: 85, max: 165, gradient: presetGradients.green },
      { min: 165, max: 210, gradient: presetGradients.cyan },
      { min: 210, max: 256, gradient: presetGradients.blue },
      { min: 256, max: 333, gradient: presetGradients.magenta },
      { min: 333, max: 360, gradient: presetGradients.red },
    ];

    return (
      hueRanges.find(({ min, max }) => isInRange(hueDegree, min, max))
        ?.gradient ?? presetGradients.default
    );
  }, [hueDegree]);
  return gradient;
}

export function usePresetGradientForColor(color?: string) {
  const colorInfo = useMemo(
    () => (color ? hexToHSL(color) : { h: 0, s: 0, l: 0 }),
    [color],
  );

  const gradient = useHueToGradient(colorInfo.h);
  const presetGradientForColor = useMemo(() => {
    if (
      !color ||
      colorInfo.l < 0.1 ||
      colorInfo.l > 0.9 ||
      colorInfo.s < 0.05
    ) {
      return presetGradients.default;
    }

    return gradient;
  }, [color, colorInfo, gradient]);

  return presetGradientForColor;
}
