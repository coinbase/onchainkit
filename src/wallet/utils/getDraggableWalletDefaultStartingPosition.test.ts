import { describe, it, expect, vi } from 'vitest';
import { getDraggableWalletDefaultStartingPosition } from './getDraggableWalletDefaultStartingPosition';

describe('getDraggableWalletDefaultStartingPosition', () => {
  it('returns default position when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    const position = getDraggableWalletDefaultStartingPosition();
    expect(position).toEqual({ x: 100, y: 100 });
    vi.unstubAllGlobals();
  });

  it('returns position based on window dimensions', () => {
    vi.stubGlobal('window', {
      innerWidth: 1024,
      innerHeight: 768,
    });

    const position = getDraggableWalletDefaultStartingPosition();
    expect(position).toEqual({ x: 899, y: 643 }); // 1024-125, 768-125

    vi.unstubAllGlobals();
  });
});
