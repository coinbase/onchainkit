import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBaseDefaultProfilePicture } from './getBaseDefaultProfilePicture';

describe('getBaseDefaultProfilePicture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct resolver data for base mainnet', async () => {
    const defaultAvatar = getBaseDefaultProfilePicture('shrek.base.eth');
    const validString = defaultAvatar.startsWith('data:image/svg+xml;base64');
    expect(validString).toBe(true);
  });

  it('should return correct resolver data for base sepolia', async () => {
    const defaultAvatar = getBaseDefaultProfilePicture('shrek.basetest.eth');
    const validString = defaultAvatar.startsWith('data:image/svg+xml;base64');
    expect(validString).toBe(true);
  });
});
