import { EarnDetails } from '@/earn/components/EarnDetails';
import type { EarnContextType } from '@/earn/types';
import { usdcToken } from '@/token/constants';
import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';

const baseContext: EarnContextType = {
  underlyingBalance: '1000',
  underlyingBalanceStatus: 'success',
  setDepositAmount: vi.fn(),
  vaultAddress: '0x123' as Address,
  depositAmount: '0',
  receiptBalance: '0',
  receiptBalanceStatus: 'success',
  setWithdrawAmount: vi.fn(),
  depositCalls: [],
  withdrawCalls: [],
  vaultToken: usdcToken,
  lifecycleStatus: { statusName: 'init', statusData: null },
  updateLifecycleStatus: vi.fn(),
  withdrawAmount: '0',
  refetchUnderlyingBalance: vi.fn(),
  refetchReceiptBalance: vi.fn(),
  depositAmountError: null,
  withdrawAmountError: null,
  apy: 0.05,
  nativeApy: 0.05,
  vaultFee: 0.01,
  rewards: [],
  vaultName: 'Vault Name',
  deposits: '1000',
  liquidity: '1000',
};

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('EarnDetails Component', () => {
  const mockUseEarnContext = useEarnContext as Mock;

  beforeEach(() => {
    mockUseEarnContext.mockReturnValue(baseContext);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(<EarnDetails className={customClass} />);

    const container = screen.getByTestId('ockEarnDetails');
    expect(container).toHaveClass(customClass);
  });
});
