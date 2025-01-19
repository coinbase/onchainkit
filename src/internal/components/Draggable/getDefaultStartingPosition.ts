export function getDefaultStartingPosition() {
  if (typeof window === 'undefined') {
    return { x: 100, y: 100 };
  }

  return {
    x: window.innerWidth * 0.95,
    y: window.innerHeight * 0.95,
  };
}
