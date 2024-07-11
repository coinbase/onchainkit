/**
 * @jest-environment jsdom
 */

import { getName } from './getName';
import { publicClient } from '../../network/client';
import type { Address } from 'viem';
import { base, baseSepolia, mainnet, optimism, sepolia } from 'viem/chains';
import { getChainPublicClient } from '../../network/getChainPublicClient';

jest.mock('../../network/client');
jest.mock('../getSlicedAddress', () => ({
  getSlicedAddress: jest.fn(),
}));

jest.mock('../../network/getChainPublicClient', () => ({
  ...jest.requireActual('../../network/getChainPublicClient'),
  getChainPublicClient: jest.fn(() => publicClient),
}));

describe('getName', () => {
  const mockGetEnsName = publicClient.getEnsName as jest.Mock;
  const mockReadContract = publicClient.readContract as jest.Mock;
  const walletAddress = '0x1234567890123456789012345678901234567890' as Address;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct value from client getName', async () => {
    const expectedEnsName = 'avatarUrl';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress });
    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
  });

  it('should return null name when client ', async () => {
    const expectedEnsName = 'avatarUrl';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress });
    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
  });

  it('should return null client getName throws an error', async () => {
    mockGetEnsName.mockRejectedValue(new Error('This is an error'));
    await expect(getName({ address: walletAddress })).rejects.toThrow(
      'This is an error',
    );
  });

  it('should return null when the ENS name is not found', async () => {
    mockGetEnsName.mockResolvedValue(null);
    const name = await getName({ address: walletAddress });
    expect(name).toBe(null);
  });

  it('should return mainnet username', async () => {
    const expectedEnsName = 'leo.eth';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chainId: mainnet.id });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet);
  });

  it('should return sepolia username', async () => {
    const expectedEnsName = 'leo.test.eth';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chainId: sepolia.id });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(sepolia);
  });

  it('should return custom testnet chain username', async () => {
    const expectedEnsName = 'leo.customtestnet.eth';
    mockReadContract.mockResolvedValue(expectedEnsName);
    const name = await getName({
      address: walletAddress,
      chainId: baseSepolia.id,
    });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(baseSepolia);
  });

  it('should return custom mainnet username', async () => {
    const expectedEnsName = 'leo.custommainnet.eth';
    mockReadContract.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chainId: base.id });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(base);
  });

  it('should return null if user is not registered', async () => {
    const expectedEnsName = null;
    mockReadContract.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chainId: base.id });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(base);
  });

  it('should throw an error on unsupported chain', async () => {
    await expect(
      getName({ address: walletAddress, chainId: optimism.id }),
    ).rejects.toThrow(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );
  });
});
