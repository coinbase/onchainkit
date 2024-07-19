import { beforeEach, describe, expect, it, vi } from 'vitest';
import { publicClient } from '../../network/client';
import { getAvatar } from './getAvatar';

vi.mock('../../network/client');

describe('getAvatar', () => {
  const mockGetEnsAvatar = publicClient.getEnsAvatar as vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct avatar URL from client getAvatar', async () => {
    const ensName = 'test.ens';
    const expectedAvatarUrl = 'avatarUrl';

    mockGetEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getAvatar({ ensName });

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenCalledWith({ name: ensName });
  });

  it('should return null when client getAvatar throws an error', async () => {
    const ensName = 'test.ens';

    mockGetEnsAvatar.mockRejectedValue(new Error('This is an error'));

    await expect(getAvatar({ ensName })).rejects.toThrow('This is an error');
  });
});
