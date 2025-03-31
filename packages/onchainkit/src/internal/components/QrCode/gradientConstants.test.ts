import { describe, expect, it } from 'vitest';
import {
  GRADIENT_END_COORDINATES,
  GRADIENT_END_STYLE,
  GRADIENT_START_COORDINATES,
  QR_CODE_SIZE,
  QR_LOGO_BACKGROUND_COLOR,
  QR_LOGO_RADIUS,
  QR_LOGO_SIZE,
  linearGradientStops,
  ockThemeToLinearGradientColorMap,
  ockThemeToRadialGradientColorMap,
  presetGradients,
} from './gradientConstants';

describe('QR Code Constants', () => {
  it('should have correct size constants', () => {
    expect(QR_CODE_SIZE).toBe(237);
    expect(QR_LOGO_SIZE).toBe(50);
    expect(QR_LOGO_RADIUS).toBe(10);
  });

  it('should have correct logo background color', () => {
    expect(QR_LOGO_BACKGROUND_COLOR).toBe('#ffffff');
  });

  it('should have correct gradient coordinates', () => {
    expect(GRADIENT_START_COORDINATES).toEqual({ x: 0, y: 0 });
    expect(GRADIENT_END_COORDINATES).toEqual({ x: 1, y: 0 });
  });

  it('should have correct gradient end style', () => {
    expect(GRADIENT_END_STYLE).toEqual({ borderRadius: 32 });
  });
});

describe('Theme Maps', () => {
  it('should have correct linear gradient theme mappings', () => {
    expect(ockThemeToLinearGradientColorMap).toEqual({
      default: 'blue',
      base: 'baseBlue',
      cyberpunk: 'pink',
      hacker: 'black',
    });
  });

  it('should have correct radial gradient theme mappings', () => {
    expect(ockThemeToRadialGradientColorMap).toEqual({
      default: 'default',
      base: 'blue',
      cyberpunk: 'magenta',
      hacker: 'black',
    });
  });
});

describe('Linear Gradient Stops', () => {
  it('should have correct blue gradient colors', () => {
    expect(linearGradientStops.blue).toEqual({
      startColor: '#266EFF',
      endColor: '#45E1E5',
    });
  });

  it('should have correct pink gradient colors', () => {
    expect(linearGradientStops.pink).toEqual({
      startColor: '#EE5A67',
      endColor: '#CE46BD',
    });
  });

  it('should have all required gradient themes', () => {
    const expectedThemes = ['blue', 'pink', 'black', 'baseBlue'];

    for (const theme of expectedThemes) {
      expect(linearGradientStops[theme]).toBeDefined();
      expect(linearGradientStops[theme].startColor).toBeDefined();
      expect(linearGradientStops[theme].endColor).toBeDefined();
    }
  });
});

describe('Preset Gradients', () => {
  it('should have correct default gradient stops', () => {
    expect(presetGradients.default).toEqual([
      ['#0F27FF', '39.06%'],
      ['#6100FF', '76.56%'],
      ['#201F1D', '100%'],
    ]);
  });

  it('should have all required preset themes', () => {
    const expectedPresets = ['default', 'blue', 'magenta', 'black'];

    for (const preset of expectedPresets) {
      expect(
        presetGradients[preset as keyof typeof presetGradients],
      ).toBeDefined();
      expect(
        Array.isArray(presetGradients[preset as keyof typeof presetGradients]),
      ).toBe(true);
      expect(
        presetGradients[preset as keyof typeof presetGradients].length,
      ).toBe(3);
    }
  });

  it('should have valid percentage formats for all gradients', () => {
    for (const gradient of Object.values(presetGradients)) {
      for (const item of gradient) {
        const percentage = item[1];
        expect(percentage).toMatch(/^\d+(\.\d+)?%$/);
      }
    }
  });
});
