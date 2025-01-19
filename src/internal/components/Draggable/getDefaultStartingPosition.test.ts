import { describe, expect, it, vi } from 'vitest';
import { getDefaultStartingPosition } from './getDefaultStartingPosition';

describe('getDefaultStartingPosition', () => {
  it('returns default position when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    const position = getDefaultStartingPosition();
    expect(position).toEqual({ x: 100, y: 100 });
    vi.unstubAllGlobals();
  });

  it('returns position based on window dimensions', () => {
    vi.stubGlobal('window', {
      innerWidth: 1024,
      innerHeight: 768,
    });

    const position = getDefaultStartingPosition();
    expect(position).toEqual({ x: 1024 * 0.95, y: 768 * 0.95 });

    vi.unstubAllGlobals();
  });
});
