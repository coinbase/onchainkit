import { publicClient } from '@/core/network/client';
import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import type { Address } from 'viem';
import { base, baseSepolia, mainnet, optimism, sepolia } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { getName } from './getName';

vi.mock('@/core/network/client');

vi.mock('@/core/utils/getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

describe('getName', () => {
  const mockGetEnsName = publicClient.getEnsName as Mock;
  const mockReadContract = publicClient.readContract as Mock;
  const walletAddress = '0x1234567890123456789012345678901234567890' as Address;

  beforeEach(() => {
    vi.clearAllMocks();
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
    const name = await getName({ address: walletAddress, chain: mainnet });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet);
  });

  it('should return sepolia username', async () => {
    const expectedEnsName = 'leo.test.eth';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chain: sepolia });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(sepolia);
  });

  it('should return custom testnet chain username', async () => {
    const expectedEnsName = 'leo.customtestnet.eth';
    mockReadContract.mockResolvedValue(expectedEnsName);
    const name = await getName({
      address: walletAddress,
      chain: baseSepolia,
    });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(baseSepolia);
  });

  it('should return custom mainnet username', async () => {
    const expectedEnsName = 'leo.custommainnet.eth';
    mockReadContract.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chain: base });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(base);
  });

  it('should return null if user is not registered', async () => {
    const expectedEnsName = null;
    mockReadContract.mockResolvedValue(expectedEnsName);
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chain: base });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(base);
  });

  it('should default to ENS name if custom chain name is not registered', async () => {
    const expectedBaseName = null;
    const expectedEnsName = 'registered.eth';
    mockReadContract.mockResolvedValue(expectedBaseName);
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chain: base });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(base);
  });

  it('should throw an error on unsupported chain', async () => {
    await expect(
      getName({ address: walletAddress, chain: optimism }),
    ).rejects.toBe(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );
  });

  it('should default to ENS when readContract throws an error', async () => {
    const expectedEnsName = 'zizzamia.eth';
    mockReadContract.mockRejectedValue(new Error('This is an error'));
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    const name = await getName({ address: walletAddress, chain: base });
    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(base);
  });
});
