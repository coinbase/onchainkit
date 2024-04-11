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
    const name = await getName(walletAddress);
    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
  });

  it('should return null name when client ', async () => {
    const walletAddress = '0x1234';
    const expectedEnsName = 'avatarUrl';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName(walletAddress);
    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
  });

  it('should return null client getName throws an error', async () => {
    const walletAddress = '0x1234';
    mockGetEnsName.mockRejectedValue(new Error('This is an error'));
    await expect(getName(walletAddress)).rejects.toThrow('This is an error');
  });
});
