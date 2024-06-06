/**
 * @jest-environment jsdom
 */

import { getEnsAvatar } from './getAvatar';
import { publicClient } from '../../network/client';

jest.mock('../../network/client');

describe('getEnsAvatar', () => {
  const mockGetEnsAvatar = publicClient.getEnsAvatar as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct avatar URL from client getEnsAvatar', async () => {
    const ensName = 'test.ens';
    const expectedAvatarUrl = 'avatarUrl';

    mockGetEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getEnsAvatar(ensName);

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenCalledWith({ name: ensName });
  });

  it('should return null when client getEnsAvatar throws an error', async () => {
    const ensName = 'test.ens';

    mockGetEnsAvatar.mockRejectedValue(new Error('This is an error'));

    await expect(getEnsAvatar(ensName)).rejects.toThrow('This is an error');
  });
});
