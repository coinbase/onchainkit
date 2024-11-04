import { describe, expect, it } from 'vitest';
import { IsValidIpfsUrl, convertIpfsToHttps } from './ipfs';

describe('IsValidIpfsUrl', () => {
  it('should return true for a valid IPFS URL', () => {
    const url = 'ipfs://QmTzQ1Nj5x1r1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1';
    expect(IsValidIpfsUrl(url)).toBe(true);
  });

  it('should return false for an invalid IPFS URL', () => {
    const url = 'https://example.com';
    expect(IsValidIpfsUrl(url)).toBe(false);
  });

  it('should return false for a malformed URL', () => {
    const url = 'not-a-url';
    expect(IsValidIpfsUrl(url)).toBe(false);
  });
});

describe('convertIpfsToHttps', () => {
  it('should convert a valid IPFS URL to an HTTPS URL', () => {
    const url = 'ipfs://QmTzQ1Nj5x1r1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1';
    const expectedUrl =
      'https://ipfs.io/ipfs/QmTzQ1Nj5x1r1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1';
    expect(convertIpfsToHttps(url)).toBe(expectedUrl);
  });

  it('should return the original URL if it is not a valid IPFS URL', () => {
    const url = 'https://example.com';
    expect(convertIpfsToHttps(url)).toBe(url);
  });

  it('should return undefined if the input URL is undefined', () => {
    expect(convertIpfsToHttps(undefined)).toBeUndefined();
  });
});
