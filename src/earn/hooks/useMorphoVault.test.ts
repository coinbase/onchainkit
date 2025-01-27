import { MORPHO_ADDRESS } from '@/earn/constants';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  type UseReadContractReturnType,
  type UseReadContractsReturnType,
  useReadContract,
  useReadContracts,
} from 'wagmi';
import { useMorphoVault } from './useMorphoVault';

const DUMMY_ADDRESS = '0x9E95f497a7663B70404496dB6481c890C4825fe1' as const;

// Mock dependencies
vi.mock('wagmi', () => ({
  useReadContract: vi.fn(),
  useReadContracts: vi.fn(),
}));

describe('useMorphoVault', () => {
  const mockParams = {
    vaultAddress: DUMMY_ADDRESS,
    address: DUMMY_ADDRESS,
  };

  it('returns undefined values when contract reads are pending', () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: undefined,
      status: 'pending',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>); // for brevity
    vi.mocked(useReadContract).mockReturnValue({
      data: undefined,
    } as UseReadContractReturnType<unknown[], string, unknown[], unknown>); // for brevity

    const { result } = renderHook(() => useMorphoVault(mockParams));

    expect(result.current).toEqual({
      status: 'pending',
      asset: undefined,
      assetDecimals: undefined,
      vaultDecimals: undefined,
      name: undefined,
      balance: undefined,
      totalApy: 0.05,
      nativeApy: 0.03,
      rewards: [
        {
          apy: 0,
          asset: MORPHO_ADDRESS,
          assetName: 'Morpho',
        },
        {
          apy: 0.02,
          asset: '0x1234',
          assetName: 'RewardToken',
        },
      ],
    });
  });

  it('returns formatted data when contract reads are successful', () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: [
        { result: DUMMY_ADDRESS }, // asset
        { result: 'Morpho Vault' }, // name
        { result: 1000000000000000000n }, // balanceOf
        { result: 18 }, // decimals
      ],
      status: 'success',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>); // for brevity
    vi.mocked(useReadContract).mockReturnValue({
      data: 18,
    } as UseReadContractReturnType<unknown[], string, unknown[], unknown>); // for brevity

    const { result } = renderHook(() => useMorphoVault(mockParams));

    expect(result.current).toEqual({
      status: 'success',
      asset: DUMMY_ADDRESS,
      assetDecimals: 18,
      vaultDecimals: 18,
      name: 'Morpho Vault',
      balance: '1',
      totalApy: 0.05,
      nativeApy: 0.03,
      rewards: [
        {
          apy: 0,
          asset: MORPHO_ADDRESS,
          assetName: 'Morpho',
        },
        {
          apy: 0.02,
          asset: '0x1234',
          assetName: 'RewardToken',
        },
      ],
    });
  });

  it('handles missing balance data', () => {
    vi.mocked(useReadContracts).mockReturnValue({
      data: [
        { result: DUMMY_ADDRESS },
        { result: 'Morpho Vault' },
        { result: undefined }, // missing balance
        { result: 18 },
      ],
      status: 'success',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>); // for brevity
    vi.mocked(useReadContract).mockReturnValue({
      data: 18,
    } as UseReadContractReturnType<unknown[], string, unknown[], unknown>); // for brevity

    const { result } = renderHook(() => useMorphoVault(mockParams));

    expect(result.current.balance).toBeUndefined();
  });

  it('includes APY and rewards data when available', () => {
    vi.mock('@tanstack/react-query', () => ({
      useQuery: vi.fn().mockReturnValue({
        data: {
          state: {
            netApy: 0.05,
            netApyWithoutRewards: 0.03,
            rewards: [
              {
                asset: {
                  address: '0x1234',
                  name: 'RewardToken',
                },
                supplyApr: 0.02,
              },
            ],
          },
        },
      }),
    }));

    vi.mocked(useReadContracts).mockReturnValue({
      data: [
        { result: DUMMY_ADDRESS },
        { result: 'Morpho Vault' },
        { result: 1000000000000000000n },
        { result: 18 },
      ],
      status: 'success',
    } as UseReadContractsReturnType<unknown[], boolean, unknown>);
    vi.mocked(useReadContract).mockReturnValue({
      data: 18,
    } as UseReadContractReturnType<unknown[], string, unknown[], unknown>);

    const { result } = renderHook(() => useMorphoVault(mockParams));

    expect(result.current).toEqual({
      status: 'success',
      asset: DUMMY_ADDRESS,
      assetDecimals: 18,
      vaultDecimals: 18,
      name: 'Morpho Vault',
      balance: '1',
      totalApy: 0.05,
      nativeApy: 0.03,
      rewards: [
        {
          asset: MORPHO_ADDRESS,
          assetName: 'Morpho',
          apy: 0,
        },
        {
          asset: '0x1234',
          assetName: 'RewardToken',
          apy: 0.02,
        },
      ],
    });
  });
});
