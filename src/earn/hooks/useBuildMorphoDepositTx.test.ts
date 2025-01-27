import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  type UseBuildMorphoDepositTxParams,
  useBuildMorphoDepositTx,
} from './useBuildMorphoDepositTx';
import { useMorphoVault } from './useMorphoVault';

const DUMMY_ADDRESS = '0x9E95f497a7663B70404496dB6481c890C4825fe1' as const;

// Mock dependencies
vi.mock('./useMorphoVault');
vi.mock('@/earn/utils/buildDepositToMorphoTx', () => ({
  buildDepositToMorphoTx: vi
    .fn()
    .mockReturnValue([{ to: '0x123', data: '0x456' }]),
}));

describe('useBuildMorphoDepositTx', () => {
  const mockParams: UseBuildMorphoDepositTxParams = {
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
    });

    const { result } = renderHook(() => useBuildMorphoDepositTx(mockParams));

    expect(result.current.calls).toEqual([]);
  });

  it('builds deposit transaction when vault data is available', () => {
    const mockAsset = DUMMY_ADDRESS;
    const mockDecimals = 18;

    vi.mocked(useMorphoVault).mockReturnValue({
      status: 'success',
      asset: mockAsset,
      balance: '1000',
      assetDecimals: mockDecimals,
      vaultDecimals: mockDecimals,
      name: 'Mock Name',
    });

    const { result } = renderHook(() => useBuildMorphoDepositTx(mockParams));

    expect(result.current.calls).toEqual([{ to: '0x123', data: '0x456' }]);
    expect(result.current.calls).toHaveLength(1);
  });
});
