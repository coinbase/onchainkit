import { describe, expect, it } from 'vitest';
import { getAddressTokenBalances } from './getAddressTokenBalances';

describe('getAddressTokenBalances', () => {
  it('should return an empty array for an invalid address', async () => {
    const result = await getAddressTokenBalances('invalid-address');
    expect(result).toEqual([]);
  });

  it('should return an empty array for a null address', async () => {
    const result = await getAddressTokenBalances(null);
    expect(result).toEqual([]);
  });
});
