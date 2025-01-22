import { describe, expect, it } from 'vitest';
import { getSlicedAddress } from './getSlicedAddress';

describe('getSlicedAddress', () => {
  it('should return a string of class names', () => {
    const address = getSlicedAddress(
      '0x1234567890123456789012345678901234567890',
    );
    expect(address).toEqual('0x1234...7890');
  });
});
