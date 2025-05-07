import { publicClient } from '@/core/network/client';
import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import type { Address } from 'viem';
import { base, mainnet, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { getAddress } from './getAddress';
import { getName } from './getName';

vi.mock('@/core/network/client');

vi.mock('@/core/utils/getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

vi.mock('./getAddress', () => ({
  getAddress: vi.fn(),
}));

describe('getName', () => {
  const mockGetEnsName = publicClient.getEnsName as Mock;
  const mockReadContract = publicClient.readContract as Mock;
  const mockGetAddress = getAddress as Mock;
  const walletAddress = '0x1234567890123456789012345678901234567890' as Address;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return ENS name after successful bidirectional validation', async () => {
    const expectedEnsName = 'vitalik.eth';
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    mockGetAddress.mockResolvedValue(walletAddress);

    const name = await getName({ address: walletAddress });

    expect(name).toBe(expectedEnsName);
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: expectedEnsName,
    });
  });

  it('should return null when forward resolution validation fails', async () => {
    const ensName = 'spoofed.eth';
    const differentAddress = '0xDifferentAddress' as Address;
    mockGetEnsName.mockResolvedValue(ensName);

    mockGetAddress.mockResolvedValue(differentAddress);

    const name = await getName({ address: walletAddress });

    expect(name).toBeNull();
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: ensName,
    });
  });

  it('should return null when forward resolution returns null', async () => {
    const ensName = 'nonexistent.eth';
    mockGetEnsName.mockResolvedValue(ensName);

    mockGetAddress.mockResolvedValue(null);

    const name = await getName({ address: walletAddress });

    expect(name).toBeNull();
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: ensName,
    });
  });

  it('should handle forward resolution validation errors gracefully', async () => {
    const ensName = 'error.eth';
    mockGetEnsName.mockResolvedValue(ensName);

    mockGetAddress.mockRejectedValue(new Error('Forward resolution error'));

    const name = await getName({ address: walletAddress });

    expect(name).toBeNull();
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: ensName,
    });
  });

  it('should return validated basename on Base chain', async () => {
    const expectedBaseName = 'user.base';
    mockReadContract.mockResolvedValue(expectedBaseName);

    mockGetAddress.mockResolvedValue(walletAddress);

    const name = await getName({ address: walletAddress, chain: base });

    expect(name).toBe(expectedBaseName);
    expect(mockReadContract).toHaveBeenCalled();
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: expectedBaseName,
    });

    expect(mockGetEnsName).not.toHaveBeenCalled();
  });

  it('should fallback to ENS when basename validation fails', async () => {
    const baseName = 'spoofed.base';
    const ensName = 'legitimate.eth';
    const differentAddress = '0xDifferentAddress' as Address;

    mockReadContract.mockResolvedValue(baseName);
    mockGetAddress.mockResolvedValueOnce(differentAddress);

    mockGetEnsName.mockResolvedValue(ensName);
    mockGetAddress.mockResolvedValueOnce(walletAddress);

    const name = await getName({ address: walletAddress, chain: base });

    expect(name).toBe(ensName);
    expect(mockReadContract).toHaveBeenCalled();
    expect(mockGetEnsName).toHaveBeenCalled();
    expect(mockGetAddress).toHaveBeenCalledTimes(2);
  });

  it('should return null when both basename and ENS validation fail', async () => {
    const baseName = 'spoofed.base';
    const ensName = 'also-spoofed.eth';
    const differentAddress = '0xDifferentAddress' as Address;

    mockReadContract.mockResolvedValue(baseName);
    mockGetAddress.mockResolvedValueOnce(differentAddress);

    mockGetEnsName.mockResolvedValue(ensName);
    mockGetAddress.mockResolvedValueOnce(differentAddress);

    const name = await getName({ address: walletAddress, chain: base });

    expect(name).toBeNull();
    expect(mockGetAddress).toHaveBeenCalledTimes(2);
  });

  it('should throw an error on unsupported chain', async () => {
    await expect(
      getName({ address: walletAddress, chain: optimism }),
    ).rejects.toBe(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );
  });

  it('should fallback to ENS when readContract throws an error', async () => {
    const expectedEnsName = 'zizzamia.eth';
    mockReadContract.mockRejectedValue(new Error('This is an error'));
    mockGetEnsName.mockResolvedValue(expectedEnsName);
    mockGetAddress.mockResolvedValue(walletAddress);

    const name = await getName({ address: walletAddress, chain: base });

    expect(name).toBe(expectedEnsName);
    expect(getChainPublicClient).toHaveBeenCalledWith(base);

    expect(getChainPublicClient).toHaveBeenLastCalledWith(mainnet);
  });

  it('should validate addresses case-insensitively', async () => {
    const ensName = 'case-insensitive.eth';
    const upperCaseAddress = walletAddress.toUpperCase() as Address;

    mockGetEnsName.mockResolvedValue(ensName);
    mockGetAddress.mockResolvedValue(upperCaseAddress);

    const name = await getName({
      address: walletAddress.toLowerCase() as Address,
    });

    expect(name).toBe(ensName);
  });

  it('should fallback to ENS when basename forward resolution verification throws an error', async () => {
    const baseName = 'user.base';
    const ensName = 'user.eth';
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockReadContract.mockResolvedValue(baseName);
    mockGetAddress.mockRejectedValueOnce(
      new Error('Forward resolution verification error'),
    );

    mockGetEnsName.mockResolvedValue(ensName);
    mockGetAddress.mockResolvedValueOnce(walletAddress);

    const name = await getName({ address: walletAddress, chain: base });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during basename forward resolution verification:',
      expect.any(Error),
    );

    expect(name).toBe(ensName);
    expect(mockGetEnsName).toHaveBeenCalled();
    expect(mockGetAddress).toHaveBeenCalledTimes(2);

    consoleSpy.mockRestore();
  });

  it('should return null when ENS resolution throws an error', async () => {
    mockGetEnsName.mockRejectedValue(new Error('ENS resolution error'));

    const name = await getName({ address: walletAddress });

    expect(name).toBeNull();
    expect(mockGetEnsName).toHaveBeenCalledWith({ address: walletAddress });
    expect(mockGetAddress).not.toHaveBeenCalled();
  });
});
