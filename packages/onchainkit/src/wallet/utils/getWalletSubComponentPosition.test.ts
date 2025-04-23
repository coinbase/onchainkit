import { describe, expect, it, vi } from 'vitest';
import {
  WALLET_ADVANCED_MAX_HEIGHT,
  WALLET_ADVANCED_MAX_WIDTH,
} from '../constants';
import { calculateSubComponentPosition } from './getWalletSubComponentPosition';

describe('calculateSubComponentPosition', () => {
  // Mock window dimensions
  const mockWindow = (innerWidth: number, innerHeight: number) => {
    vi.stubGlobal('window', {
      innerWidth,
      innerHeight,
    });
  };

  it('returns default values when window is undefined', () => {
    vi.stubGlobal('window', undefined);

    const result = calculateSubComponentPosition({} as DOMRect);

    expect(result).toEqual({
      showAbove: false,
      alignRight: false,
    });
  });

  it('shows below and left when enough space available', () => {
    mockWindow(1000, 1000);

    const rect = {
      bottom: 200,
      left: 200,
    } as DOMRect;

    const result = calculateSubComponentPosition(rect);

    expect(result).toEqual({
      showAbove: false,
      alignRight: false,
    });
  });

  it('shows above when not enough space below', () => {
    mockWindow(1000, 500);

    const rect = {
      bottom: 500 - WALLET_ADVANCED_MAX_HEIGHT + 50, // Not enough space below
      left: 200,
    } as DOMRect;

    const result = calculateSubComponentPosition(rect);

    expect(result).toEqual({
      showAbove: true,
      alignRight: false,
    });
  });

  it('aligns right when not enough space to the right', () => {
    mockWindow(500, 1000);

    const rect = {
      bottom: 200,
      left: 500 - WALLET_ADVANCED_MAX_WIDTH + 50, // Not enough space right
    } as DOMRect;

    const result = calculateSubComponentPosition(rect);

    expect(result).toEqual({
      showAbove: false,
      alignRight: true,
    });
  });

  it('shows above and aligns right when no space below or right', () => {
    mockWindow(500, 500);

    const rect = {
      bottom: 500 - WALLET_ADVANCED_MAX_HEIGHT + 50,
      left: 500 - WALLET_ADVANCED_MAX_WIDTH + 50,
    } as DOMRect;

    const result = calculateSubComponentPosition(rect);

    expect(result).toEqual({
      showAbove: true,
      alignRight: true,
    });
  });
});
