import { renderHook } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import {
  type UseBuildDepositToMorphoTxParams,
  useBuildDepositToMorphoTx,
} from './useBuildDepositToMorphoTx';
import { useMorphoVault } from './useMorphoVault';

const DUMMY_ADDRESS = '0x9E95f497a7663B70404496dB6481c890C4825fe1' as const;

// Mock dependencies
vi.mock('./useMorphoVault');
vi.mock('@/earn/utils/buildDepositToMorphoTx', () => ({
  buildDepositToMorphoTx: vi
    .fn()
    .mockReturnValue([{ to: '0x123', data: '0x456' }]),
}));

describe('useBuildDepositToMorphoTx', () => {
  const mockParams: UseBuildDepositToMorphoTxParams = {
    vaultAddress: DUMMY_ADDRESS,
    recipientAddress: DUMMY_ADDRESS,
    amount: '100',
  };

  it('returns empty calls when vault data is not available', () => {
    vi.mocked(useMorphoVault as Mock).mockReturnValue({
      status: 'pending',
      asset: undefined,
      assetSymbol: undefined,
      balance: undefined,
      assetDecimals: undefined,
      vaultDecimals: undefined,
      name: undefined,
      totalApy: undefined,
      nativeApy: undefined,
      rewards: undefined,
    });

    const { result } = renderHook(() => useBuildDepositToMorphoTx(mockParams));

    expect(result.current.calls).toEqual([]);
  });

  it('builds deposit transaction when vault data is available', () => {
    const mockAsset = DUMMY_ADDRESS;
    const mockDecimals = 18;

    vi.mocked(useMorphoVault as Mock).mockReturnValue({
      status: 'success',
      asset: {
        address: mockAsset,
        symbol: 'USDC',
        decimals: mockDecimals,
      },
      balance: '1000',
      assetDecimals: mockDecimals,
      vaultDecimals: mockDecimals,
      name: 'Mock Name',
      totalApy: 10,
      nativeApy: 10,
      rewards: [],
      balanceStatus: 'success',
    });

    const { result } = renderHook(() => useBuildDepositToMorphoTx(mockParams));

    expect(result.current.calls).toEqual([{ to: '0x123', data: '0x456' }]);
    expect(result.current.calls).toHaveLength(1);
  });
});
