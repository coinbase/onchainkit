import { http } from 'viem';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { createConfig } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { L2OutputOracleABI } from '../abi';
import type { AppchainConfig } from '../types';
import { getOutput } from './getOutput';

vi.mock('wagmi/actions', () => ({
  readContract: vi.fn(),
}));

describe('getOutput', () => {
  const mockConfig: AppchainConfig = {
    chainId: 8453,
    contracts: {
      l2OutputOracle:
        '0x56315b90c40730925ec5485cf004d835058518A0' as `0x${string}`,
      systemConfig: '0x0' as `0x${string}`,
      optimismPortal: '0x0' as `0x${string}`,
      l1CrossDomainMessenger: '0x0' as `0x${string}`,
      l1StandardBridge: '0x0' as `0x${string}`,
      l1ERC721Bridge: '0x0' as `0x${string}`,
      optimismMintableERC20Factory: '0x0' as `0x${string}`,
    },
  };

  const mockWagmiConfig = createConfig({
    chains: [base],
    transports: {
      [base.id]: http(),
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch output index and output data', async () => {
    const mockOutputIndex = 123n;
    const mockOutput = {
      outputRoot: '0x123' as `0x${string}`,
      timestamp: 456n,
      l2BlockNumber: 789n,
    };

    (readContract as Mock).mockResolvedValueOnce(mockOutputIndex);
    (readContract as Mock).mockResolvedValueOnce(mockOutput);

    const result = await getOutput({
      config: mockConfig,
      chain: base,
      wagmiConfig: mockWagmiConfig,
    });

    expect(readContract).toHaveBeenNthCalledWith(1, mockWagmiConfig, {
      address: mockConfig.contracts.l2OutputOracle,
      abi: L2OutputOracleABI,
      functionName: 'latestOutputIndex',
      args: [],
      chainId: base.id,
    });
    expect(readContract).toHaveBeenNthCalledWith(2, mockWagmiConfig, {
      address: mockConfig.contracts.l2OutputOracle,
      abi: L2OutputOracleABI,
      functionName: 'getL2Output',
      args: [mockOutputIndex],
      chainId: base.id,
    });

    expect(result).toEqual({
      outputIndex: mockOutputIndex,
      ...mockOutput,
    });
  });

  it('should throw an error if contract calls fail', async () => {
    const mockError = new Error('Contract call failed');
    (readContract as Mock).mockRejectedValueOnce(mockError);

    await expect(
      getOutput({
        config: mockConfig,
        chain: base,
        wagmiConfig: mockWagmiConfig,
      }),
    ).rejects.toThrow('Contract call failed');
  });
});
