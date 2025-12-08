import { describe, expect, it, vi } from 'vitest';
import { getDefaultDraggableStartingPosition } from './getDefaultDraggableStartingPosition';

describe('getDefaultDraggableStartingPosition', () => {
  it('returns default position when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    const position = getDefaultDraggableStartingPosition();
    expect(position).toEqual({ x: 100, y: 100 });
    vi.unstubAllGlobals();
  });

  it('returns position based on window dimensions', () => {
    vi.stubGlobal('window', {
      innerWidth: 1024,
      innerHeight: 768,
    });

    const position = getDefaultDraggableStartingPosition();
    expect(position).toEqual({ x: 1024 - 56 - 16, y: 768 - 56 - 16 });

    vi.unstubAllGlobals();
  });
});
