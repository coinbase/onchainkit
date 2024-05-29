import { isEntrypoint } from './isEntrypoint';
import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';

describe('isEntrypoint', () => {
  it('should return true for a valid v6 entrypoint address', () => {
    const result = isEntrypoint({ entrypoint: ENTRYPOINT_ADDRESS_V06 });
    expect(result).toEqual(true);
  });
  it('should return false if the entrypoint is not ENTRYPOINT_ADDRESS_V06', () => {
    const entrypoint = 'invalid-entrypoint';
    const result = isEntrypoint({ entrypoint });
    expect(result).toEqual(false);
  });
});
