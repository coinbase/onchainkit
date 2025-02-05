import { describe, expect, it } from 'vitest';
import { getTokenFromAddress } from './getTokenFromAddress';
import { baseTokens } from '@/token/constants';

describe('getTokenFromAddress', () => {
  it('returns matching token when address exists', () => {
    const knownAddress = baseTokens[1].address as `0x${string}`;
    const result = getTokenFromAddress(knownAddress);
    expect(result).toEqual(baseTokens[1]);
  });

  it('returns first token as fallback when address not found', () => {
    const unknownAddress = '0xunknownaddress' as `0x${string}`;
    const result = getTokenFromAddress(unknownAddress);
    expect(result).toEqual(baseTokens[0]);
  });
});
