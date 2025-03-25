import { entryPoint06Address } from 'viem/account-abstraction';
import { describe, expect, it } from 'vitest';
import { isValidAAEntrypoint } from './isValidAAEntrypoint';

describe('isValidAAEntrypoint', () => {
  it('should return true for a valid v6 entrypoint address', () => {
    const result = isValidAAEntrypoint({ entrypoint: entryPoint06Address });
    expect(result).toEqual(true);
  });
  it('should return false if the entrypoint is not ENTRYPOINT_ADDRESS_V06', () => {
    const entrypoint = 'invalid-entrypoint';
    const result = isValidAAEntrypoint({ entrypoint });
    expect(result).toEqual(false);
  });
});
