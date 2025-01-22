import { describe, expect, it, vi } from 'vitest';
import { getWalletDraggableProps } from './getWalletDraggableProps';

describe('getWalletDraggableProps', () => {
  it('returns props when draggable is false', () => {
    const props = getWalletDraggableProps({ draggable: false });
    expect(props).toEqual({ draggable: false });
  });

  it('returns props with draggableStartingPosition when draggable is true', () => {
    const props = getWalletDraggableProps({ draggable: true });
    expect(props).toEqual({
      draggable: true,
      draggableStartingPosition: {
        x: 1024 - 56 - 16,
        y: 768 - 56 - 16,
      },
    });
  });

  it('returns props with draggableStartingPosition based when draggableStartingPosition is provided', () => {
    vi.stubGlobal('window', {
      innerWidth: 1500,
      innerHeight: 1000,
    });

    const props = getWalletDraggableProps({
      draggable: true,
      draggableStartingPosition: { x: 100, y: 100 },
    });
    expect(props).toEqual({
      draggable: true,
      draggableStartingPosition: { x: 100, y: 100 },
    });

    vi.unstubAllGlobals();
  });
});
