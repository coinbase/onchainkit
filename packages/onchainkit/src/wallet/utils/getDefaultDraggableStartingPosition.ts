const MIN_GAP_TO_EDGE = 16;
const WALLET_ISLAND_SIZE = 56;

export function getDefaultDraggableStartingPosition() {
  if (typeof window === 'undefined') {
    return { x: 100, y: 100 };
  }

  return {
    x: window.innerWidth - WALLET_ISLAND_SIZE - MIN_GAP_TO_EDGE,
    y: window.innerHeight - WALLET_ISLAND_SIZE - MIN_GAP_TO_EDGE,
  };
}
