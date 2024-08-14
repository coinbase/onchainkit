import { beforeEach, describe, expect, it } from 'vitest';
import { getWindowDimensions } from './getWindowDimensions';

describe('getWindowDimensions', () => {
  beforeEach(() => {
    // Mock window.innerWidth and window.innerHeight
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
  });

  it('should return minimum width for small screens', () => {
    window.innerWidth = 300;
    window.innerHeight = 400;

    const result = getWindowDimensions('sm');
    expect(result).toEqual({ width: 270, height: 350 });
  });

  it('should calculate correct dimensions for medium size', () => {
    const result = getWindowDimensions('md');
    expect(result).toEqual({ width: 290, height: 363 });
  });

  it('should calculate correct dimensions for large size', () => {
    const result = getWindowDimensions('lg');
    expect(result).toEqual({ width: 350, height: 438 });
  });

  it('should limit dimensions to 35vw for large viewport', () => {
    window.innerWidth = 2000;
    window.innerHeight = 1500;

    const result = getWindowDimensions('lg');
    expect(result).toEqual({ width: 700, height: 875 });
  });

  it('should handle different aspect ratios', () => {
    window.innerWidth = 1920;
    window.innerHeight = 1080;

    const result = getWindowDimensions('md');
    expect(result).toEqual({ width: 557, height: 696 });
  });
});
