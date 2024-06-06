/**
 * @jest-environment jsdom
 */

import { getEnsAvatar } from './getEnsAvatar';
import { publicClient } from '../../network/client';

jest.mock('../../network/client');

describe('getEnsAvatar', () => {
  const mockGetEnsAvatar = publicClient.getEnsAvatar as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct avatar URL from client getEnsAvatar', async () => {
    const name = 'test.ens';
    const expectedAvatarUrl = 'avatarUrl';

    mockGetEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getEnsAvatar({ name });

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenCalledWith({ name });
  });

  it('should return null when client getEnsAvatar throws an error', async () => {
    const name = 'test.ens';

    mockGetEnsAvatar.mockRejectedValue(new Error('This is an error'));

    await expect(getEnsAvatar({ name })).rejects.toThrow('This is an error');
  });
});
