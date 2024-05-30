import { isValidAAEntrypoint } from './isValidAAEntrypoint';
import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';

describe('isValidAAEntrypoint', () => {
  it('should return true for a valid v6 entrypoint address', () => {
    const result = isValidAAEntrypoint({ entrypoint: ENTRYPOINT_ADDRESS_V06 });
    expect(result).toEqual(true);
  });
  it('should return false if the entrypoint is not ENTRYPOINT_ADDRESS_V06', () => {
    const entrypoint = 'invalid-entrypoint';
    const result = isValidAAEntrypoint({ entrypoint });
    expect(result).toEqual(false);
  });
});
