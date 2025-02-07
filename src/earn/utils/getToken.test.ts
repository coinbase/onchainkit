import { baseTokens } from '@/token/constants';
import { base } from 'viem/chains';
import { describe, expect, it } from 'vitest';
import { getToken } from './getToken';

describe('getToken', () => {
  it('returns matching token when address exists', () => {
    const knownAddress = baseTokens[1].address as `0x${string}`;
    const result = getToken({ address: knownAddress });
    expect(result).toEqual(baseTokens[1]);
  });

  it('returns fallback token when address not found', () => {
    const tokenDetails = {
      address: '0xunknownaddress' as `0x${string}`,
      symbol: 'unknown',
      name: 'USD Coin',
      decimals: 6,
    };

    const result = getToken(tokenDetails);
    expect(result).toEqual({
      address: tokenDetails.address,
      name: tokenDetails.name,
      symbol: tokenDetails.symbol,
      decimals: tokenDetails.decimals,
      image: null,
      chainId: base.id,
    });
  });

  it('returns undefined when address is not provided', () => {
    // @ts-expect-error - address is not provided
    const result = getToken({ address: undefined });
    expect(result).toBeUndefined();
  });
});
