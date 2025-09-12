import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import type { Address } from 'viem';
import { base, mainnet, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { getAddress } from './getAddress';
import { getName } from './getName';

vi.mock('@/core/utils/getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('@/core/network/getChainPublicClient');

vi.mock('./getAddress', () => ({
  getAddress: vi.fn(),
}));

describe('getName', () => {
  const mockGetAddress = getAddress as Mock;
  const walletAddress = '0x1234567890123456789012345678901234567890' as Address;

  const mockClient = {
    getEnsName: vi.fn(),
    readContract: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(getChainPublicClient).mockReturnValue(mockClient as any);
  });

  it('should return ENS name after successful bidirectional validation', async () => {
    const expectedEnsName = 'vitalik.eth';
    mockClient.getEnsName.mockResolvedValue(expectedEnsName);
    mockGetAddress.mockResolvedValue(walletAddress);

    const name = await getName({ address: walletAddress });

    expect(name).toBe(expectedEnsName);
    expect(mockClient.getEnsName).toHaveBeenCalledWith({
      address: walletAddress,
    });
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: expectedEnsName,
    });
  });

  it('should return null when forward resolution validation fails', async () => {
    const ensName = 'spoofed.eth';
    const differentAddress = '0xDifferentAddress' as Address;
    mockClient.getEnsName.mockResolvedValue(ensName);

    mockGetAddress.mockResolvedValue(differentAddress);

    const name = await getName({ address: walletAddress });

    expect(name).toBeNull();
    expect(mockClient.getEnsName).toHaveBeenCalledWith({
      address: walletAddress,
    });
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: ensName,
    });
  });

  it('should return null when forward resolution returns null', async () => {
    const ensName = 'nonexistent.eth';
    mockClient.getEnsName.mockResolvedValue(ensName);

    mockGetAddress.mockResolvedValue(null);

    const name = await getName({ address: walletAddress });

    expect(name).toBeNull();
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: ensName,
    });
  });

  it('should return null when address is not provided', async () => {
    const ensName = 'nonexistent.eth';
    mockClient.getEnsName.mockResolvedValue(ensName);

    mockGetAddress.mockResolvedValue(null);

    const name = await getName({ address: undefined });

    expect(name).toBeNull();
  });

  it('should handle forward resolution validation errors gracefully', async () => {
    const ensName = 'error.eth';
    mockClient.getEnsName.mockResolvedValue(ensName);

    mockGetAddress.mockRejectedValue(new Error('Forward resolution error'));

    const name = await getName({ address: walletAddress });

    expect(name).toBeNull();
    expect(mockClient.getEnsName).toHaveBeenCalledWith({
      address: walletAddress,
    });
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: ensName,
    });
  });

  it('should return validated basename on Base chain', async () => {
    const expectedBaseName = 'user.base';
    mockClient.readContract.mockResolvedValue(expectedBaseName);

    mockGetAddress.mockResolvedValue(walletAddress);

    const name = await getName({ address: walletAddress, chain: base });

    expect(name).toBe(expectedBaseName);
    expect(mockClient.readContract).toHaveBeenCalled();
    expect(mockGetAddress).toHaveBeenCalledWith({
      name: expectedBaseName,
    });

    expect(mockClient.getEnsName).not.toHaveBeenCalled();
  });

  it('should fallback to ENS when basename validation fails', async () => {
    const baseName = 'spoofed.base';
    const ensName = 'legitimate.eth';
    const differentAddress = '0xDifferentAddress' as Address;

    mockClient.readContract.mockResolvedValue(baseName);
    mockGetAddress.mockResolvedValueOnce(differentAddress);

    mockClient.getEnsName.mockResolvedValue(ensName);
    mockGetAddress.mockResolvedValueOnce(walletAddress);

    const name = await getName({ address: walletAddress, chain: base });

    expect(name).toBe(ensName);
    expect(mockClient.readContract).toHaveBeenCalled();
    expect(mockClient.getEnsName).toHaveBeenCalled();
    expect(mockGetAddress).toHaveBeenCalledTimes(2);
  });

  it('should return null when both basename and ENS validation fail', async () => {
    const baseName = 'spoofed.base';
    const ensName = 'also-spoofed.eth';
    const differentAddress = '0xDifferentAddress' as Address;

    mockClient.readContract.mockResolvedValue(baseName);
    mockGetAddress.mockResolvedValueOnce(differentAddress);

    mockClient.getEnsName.mockResolvedValue(ensName);
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
    mockClient.readContract.mockRejectedValue(new Error('This is an error'));
    mockClient.getEnsName.mockResolvedValue(expectedEnsName);
    mockGetAddress.mockResolvedValue(walletAddress);

    const name = await getName({ address: walletAddress, chain: base });

    expect(name).toBe(expectedEnsName);
    expect(vi.mocked(getChainPublicClient)).toHaveBeenCalledWith(base);

    expect(vi.mocked(getChainPublicClient)).toHaveBeenLastCalledWith(mainnet);
  });

  it('should validate addresses case-insensitively', async () => {
    const ensName = 'case-insensitive.eth';
    const upperCaseAddress = walletAddress.toUpperCase() as Address;

    mockClient.getEnsName.mockResolvedValue(ensName);
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

    mockClient.readContract.mockResolvedValue(baseName);
    mockGetAddress.mockRejectedValueOnce(
      new Error('Forward resolution verification error'),
    );

    mockClient.getEnsName.mockResolvedValue(ensName);
    mockGetAddress.mockResolvedValueOnce(walletAddress);

    const name = await getName({ address: walletAddress, chain: base });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during basename forward resolution verification:',
      expect.any(Error),
    );

    expect(name).toBe(ensName);
    expect(mockClient.getEnsName).toHaveBeenCalled();
    expect(mockGetAddress).toHaveBeenCalledTimes(2);

    consoleSpy.mockRestore();
  });

  it('should return null when ENS resolution throws an error', async () => {
    mockClient.getEnsName.mockRejectedValue(new Error('ENS resolution error'));

    const name = await getName({ address: walletAddress });

    expect(name).toBeNull();
    expect(mockClient.getEnsName).toHaveBeenCalledWith({
      address: walletAddress,
    });
    expect(mockGetAddress).not.toHaveBeenCalled();
  });
});
