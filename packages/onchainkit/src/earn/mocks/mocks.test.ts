import type { EarnContextType } from '@/earn/types';
import { usdcToken } from '@/token/constants';
import type { Address } from 'viem';
import { vi, describe, it, expect } from 'vitest';

export const MOCK_EARN_CONTEXT: EarnContextType = {
  error: null,
  walletBalance: '1000',
  walletBalanceStatus: 'success',
  refetchWalletBalance: vi.fn(),
  vaultAddress: '0x123' as Address,
  vaultToken: usdcToken,
  vaultName: 'Test Vault',
  deposits: '1000',
  liquidity: '1000',
  apy: 0,
  nativeApy: 0,
  vaultFee: 0,
  rewards: [],
  depositedBalance: '1000',
  depositedBalanceStatus: 'success',
  refetchDepositedBalance: vi.fn(),
  depositAmount: '0',
  setDepositAmount: vi.fn(),
  depositAmountError: null,
  withdrawAmount: '0',
  setWithdrawAmount: vi.fn(),
  withdrawAmountError: null,
  depositCalls: [],
  withdrawCalls: [],
  lifecycleStatus: { statusName: 'init', statusData: null } as const,
  updateLifecycleStatus: vi.fn(),
  isSponsored: false,
};

describe('MOCK_EARN_CONTEXT', () => {
  it('should be defined', () => {
    expect(MOCK_EARN_CONTEXT).toBeDefined();
  });
});
