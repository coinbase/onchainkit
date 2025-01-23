import { useMorphoVault } from './useMorphoVault';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  type UseReadContractsReturnType,
  type UseReadContractReturnType,
  useReadContract,
  useReadContracts,
} from 'wagmi';

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
});
