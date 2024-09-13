import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBaseDefaultProfilePictureIndex } from './getBaseDefaultProfilePictureIndex';

describe('getBaseDefaultProfilePictureIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should always return the same index given a number of options', async () => {
    // Note: This seems silly but this tests "proves" the algorithm is deterministic
    expect(getBaseDefaultProfilePictureIndex('shrek.base.eth', 7)).toBe(3);
    expect(getBaseDefaultProfilePictureIndex('shrek.basetest.eth', 7)).toBe(4);
    expect(getBaseDefaultProfilePictureIndex('leo.base.eth', 7)).toBe(0);
    expect(getBaseDefaultProfilePictureIndex('leo.basetest.eth', 7)).toBe(3);
    expect(getBaseDefaultProfilePictureIndex('zimmania.base.eth', 7)).toBe(5);
    expect(getBaseDefaultProfilePictureIndex('zimmania.basetest.eth', 7)).toBe(
      4,
    );
  });
});
