import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment node
 */
import { isNFTError } from './isNFTError';

describe('isNFTError', () => {
  it('returns true for a valid isNFTError object', () => {
    const response = {
      error: 'NFT load failed',
      details: 'token details failed to load',
    };

    expect(isNFTError(response)).toBe(true);
  });

  it('returns false for null or non-object inputs', () => {
    expect(isNFTError(null)).toBe(false);
    expect(isNFTError(undefined)).toBe(false);
    expect(isNFTError('error')).toBe(false);
    expect(isNFTError(123)).toBe(false);
  });

  it('returns false for objects without the "error" property', () => {
    const response = {
      message: 'An error occurred',
    };

    expect(isNFTError(response)).toBe(false);
  });

  it('returns false for empty objects', () => {
    const response = {};

    expect(isNFTError(response)).toBe(false);
  });
});
