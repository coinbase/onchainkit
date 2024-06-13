/**
 * @jest-environment jsdom
 */

import { getName } from './getName';
import { publicClient } from '../../network/client';

jest.mock('../../network/client');

describe('getName', () => {
  const mockGetEnsName = publicClient.getEnsName as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct value from client getName', async () => {
    const walletAddress = '0x1234';
    const expectedEnsName = 'avatarUrl';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress });
    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
  });

  it('should return null name when client ', async () => {
    const walletAddress = '0x1234';
    const expectedEnsName = 'avatarUrl';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress });
    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
  });

  it('should return null client getName throws an error', async () => {
    const walletAddress = '0x1234';
    mockGetEnsName.mockRejectedValue(new Error('This is an error'));
    await expect(getName({ address: walletAddress })).rejects.toThrow(
      'This is an error',
    );
  });

  it('should return address when showAddress is true', async () => {
    const walletAddress = '0x1234567890123456789012345678901234567890';
    const slicedAddress = '0x123...7890';
    const name = await getName({ address: walletAddress, showAddress: true });
    expect(name).toBe(slicedAddress);
  });
});
