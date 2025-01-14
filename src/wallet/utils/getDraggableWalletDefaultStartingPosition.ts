export function getDraggableWalletDefaultStartingPosition() {
  if (typeof window === 'undefined') {
    return { x: 100, y: 100 };
  }

  return {
    x: window.innerWidth - 125,
    y: window.innerHeight - 125,
  };
}
