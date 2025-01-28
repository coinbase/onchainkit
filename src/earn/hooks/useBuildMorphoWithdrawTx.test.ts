import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  type UseBuildMorphoWithdrawTxParams,
  useBuildMorphoWithdrawTx,
} from './useBuildMorphoWithdrawTx';
import { useMorphoVault } from './useMorphoVault';

const DUMMY_ADDRESS = '0x9E95f497a7663B70404496dB6481c890C4825fe1' as const;

// Mock dependencies
vi.mock('./useMorphoVault');
vi.mock('@/earn/utils/buildWithdrawFromMorphoTx', () => ({
  buildWithdrawFromMorphoTx: vi
    .fn()
    .mockReturnValue([{ to: '0x123', data: '0x456' }]),
}));

describe('useBuildMorphoWithdrawTx', () => {
  const mockParams: UseBuildMorphoWithdrawTxParams = {
    vaultAddress: DUMMY_ADDRESS,
    receiverAddress: DUMMY_ADDRESS,
    amount: 100,
  };

  it('returns empty calls when vault data is not available', () => {
    vi.mocked(useMorphoVault).mockReturnValue({
      status: 'pending',
      asset: undefined,
      balance: undefined,
      assetDecimals: undefined,
      vaultDecimals: undefined,
      name: undefined,
      totalApy: undefined,
      nativeApy: undefined,
      rewards: undefined,
    });

    const { result } = renderHook(() => useBuildMorphoWithdrawTx(mockParams));

    expect(result.current.calls).toEqual([]);
  });

  it('returns empty calls when amount is greater than balance', () => {
    vi.mocked(useMorphoVault).mockReturnValue({
      status: 'success',
      asset: DUMMY_ADDRESS,
      balance: '50',
      assetDecimals: 18,
      vaultDecimals: 18,
      name: 'Mock Name',
      totalApy: 10,
      nativeApy: 10,
      rewards: [],
    });

    const { result } = renderHook(() => useBuildMorphoWithdrawTx(mockParams));

    expect(result.current.calls).toEqual([]);
  });

  it('builds withdraw transaction when vault data is available and amount is valid', () => {
    vi.mocked(useMorphoVault).mockReturnValue({
      status: 'success',
      asset: DUMMY_ADDRESS,
      balance: '1000',
      assetDecimals: 18,
      vaultDecimals: 18,
      name: 'Mock Name',
      totalApy: 10,
      nativeApy: 10,
      rewards: [],
    });

    const { result } = renderHook(() => useBuildMorphoWithdrawTx(mockParams));

    expect(result.current.calls).toEqual([{ to: '0x123', data: '0x456' }]);
    expect(result.current.calls).toHaveLength(1);
  });
});
