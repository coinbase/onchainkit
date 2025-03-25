import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment node
 */
import { isSwapError } from './isSwapError';

describe('isSwapError', () => {
  it('returns true for a valid SwapError object', () => {
    const response = {
      error: 'Swap failed',
      details: 'Insufficient balance',
    };

    expect(isSwapError(response)).toBe(true);
  });

  it('returns false for null or non-object inputs', () => {
    expect(isSwapError(null)).toBe(false);
    expect(isSwapError(undefined)).toBe(false);
    expect(isSwapError('error')).toBe(false);
    expect(isSwapError(123)).toBe(false);
  });

  it('returns false for objects without the "error" property', () => {
    const response = {
      message: 'An error occurred',
    };

    expect(isSwapError(response)).toBe(false);
  });

  it('returns false for empty objects', () => {
    const response = {};

    expect(isSwapError(response)).toBe(false);
  });
});
