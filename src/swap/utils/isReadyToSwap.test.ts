import { describe, expect, it } from 'vitest';
import { isReadyToSwap } from './isReadyToSwap';

describe('isReadyToSwap', () => {
  it('should return false if any of the arguments is missing', () => {
    expect(isReadyToSwap()).toBe(false);
    expect(isReadyToSwap('0x123')).toBe(false);
    expect(isReadyToSwap('0x123', { symbol: 'ETH' })).toBe(false);
    expect(isReadyToSwap('0x123', { symbol: 'ETH' }, { symbol: 'DAI' })).toBe(
      false,
    );
  });

  it('should return true if all arguments are present', () => {
    expect(
      isReadyToSwap('0x123', { symbol: 'ETH' }, { symbol: 'DAI' }, '100'),
    ).toBe(true);
  });

  it('should return false if address is missing', () => {
    expect(
      isReadyToSwap(undefined, { symbol: 'ETH' }, { symbol: 'DAI' }, '100'),
    ).toBe(false);
  });

  it('should return false if fromToken is missing', () => {
    expect(isReadyToSwap('0x123', undefined, { symbol: 'DAI' }, '100')).toBe(
      false,
    );
  });

  it('should return false if toToken is missing', () => {
    expect(isReadyToSwap('0x123', { symbol: 'ETH' }, undefined, '100')).toBe(
      false,
    );
  });

  it('should return false if amount is missing', () => {
    expect(isReadyToSwap('0x123', { symbol: 'ETH' }, { symbol: 'DAI' })).toBe(
      false,
    );
  });

  it('should return false if amount is empty', () => {
    expect(
      isReadyToSwap('0x123', { symbol: 'ETH' }, { symbol: 'DAI' }, ''),
    ).toBe(false);
  });

  it('should return true if amount is zero', () => {
    expect(
      isReadyToSwap('0x123', { symbol: 'ETH' }, { symbol: 'DAI' }, '0'),
    ).toBe(true);
  });
});
