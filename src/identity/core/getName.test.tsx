/**
 * @jest-environment jsdom
 */

import { getName } from './getName';
import { publicClient } from '../../network/client';
import type { Address } from 'viem';
import { base, baseSepolia, mainnet, optimism, sepolia } from 'viem/chains';
import { getChainPublicClient } from '../../network/chains';

jest.mock('../../network/client');
jest.mock('../getSlicedAddress', () => ({
  getSlicedAddress: jest.fn(),
}));

jest.mock('../../network/chains', () => ({
  ...jest.requireActual('../../network/chains'),
  getChainPublicClient: jest.fn(() => publicClient),
}));

describe('getName', () => {
  const mockGetEnsName = publicClient.getEnsName as jest.Mock;
  const mockReadContract = publicClient.readContract as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct value from client getName', async () => {
    const walletAddress = '0x1234' as Address;
    const expectedEnsName = 'avatarUrl';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress });
    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
  });

  it('should return null name when client ', async () => {
    const walletAddress = '0x1234' as Address;
    const expectedEnsName = 'avatarUrl';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress });
    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
  });

  it('should return null client getName throws an error', async () => {
    const walletAddress = '0x1234' as Address;
    mockGetEnsName.mockRejectedValue(new Error('This is an error'));
    await expect(getName({ address: walletAddress })).rejects.toThrow(
      'This is an error',
    );
  });

  it('should return null when the ENS name is not found', async () => {
    const walletAddress =
      '0x1234567890123456789012345678901234567890' as Address;
    mockGetEnsName.mockResolvedValue(null);
    const name = await getName({ address: walletAddress });
    expect(name).toBe(null);
  });

  it('should return mainnet username', async () => {
    const walletAddress =
      '0x1234567890123456789012345678901234567890' as Address;
    const expectedEnsName = 'leo.eth';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chainId: mainnet.id });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet.id);
  });

  it('should return sepolia username', async () => {
    const walletAddress =
      '0x1234567890123456789012345678901234567890' as Address;
    const expectedEnsName = 'leo.test.eth';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chainId: sepolia.id });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(sepolia.id);
  });

  it('should return custom testnet chain username', async () => {
    const walletAddress =
      '0x1234567890123456789012345678901234567890' as Address;
    const expectedEnsName = 'leo.customtestnet.eth';
    mockReadContract.mockResolvedValue(expectedEnsName);
    const name = await getName({
      address: walletAddress,
      chainId: baseSepolia.id,
    });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(baseSepolia.id);
  });

  it('should return custom mainnet username', async () => {
    const walletAddress =
      '0x1234567890123456789012345678901234567890' as Address;
    const expectedEnsName = 'leo.custommainnet.eth';
    mockReadContract.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chainId: base.id });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(base.id);
  });

  it('should return null if user is not registered', async () => {
    const walletAddress =
      '0x1234567890123456789012345678901234567890' as Address;
    const expectedEnsName = null;
    mockReadContract.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chainId: base.id });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(base.id);
  });

  it('should throw an error on unsupported chain', async () => {
    const walletAddress =
      '0x1234567890123456789012345678901234567890' as Address;
    await expect(
      getName({ address: walletAddress, chainId: optimism.id }),
    ).rejects.toThrow(
      'ChainId not supported, name resolution is only supported on 1, 11155111, 8453, 84532.',
    );
  });
});
