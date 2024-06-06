/**
 * @jest-environment jsdom
 */
import { getAvatar } from './getAvatar';
import { publicClient } from '../../network/client';

jest.mock('../../network/client');

describe('getAvatar', () => {
  const mockGetEnsAvatar = publicClient.getEnsAvatar as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
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
