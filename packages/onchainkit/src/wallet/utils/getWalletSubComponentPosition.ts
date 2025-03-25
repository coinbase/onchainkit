import {
  WALLET_ADVANCED_MAX_HEIGHT,
  WALLET_ADVANCED_MAX_WIDTH,
} from '../constants';

export function calculateSubComponentPosition(connectRect: DOMRect) {
  if (typeof window === 'undefined') {
    return {
      showAbove: false,
      alignRight: false,
    };
  }

  const spaceAvailableBelow = window.innerHeight - connectRect.bottom;
  const spaceAvailableRight = window.innerWidth - connectRect.left;

  return {
    showAbove: spaceAvailableBelow < WALLET_ADVANCED_MAX_HEIGHT,
    alignRight: spaceAvailableRight < WALLET_ADVANCED_MAX_WIDTH,
  };
}
