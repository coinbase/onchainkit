import type { EarnContextType } from '@/earn/types';
import { usdcToken } from '@/token/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { YieldDetails } from './YieldDetails';

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
  rewards: [{ asset: '0x456', assetName: 'REWARD', apy: 0.02 }],
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

describe('YieldDetails', () => {
  const mockUseEarnContext = useEarnContext as Mock;

  beforeEach(() => {
    mockUseEarnContext.mockReturnValue(baseContext);
  });

  it('shows loading skeleton when apy is not available', () => {
    mockUseEarnContext.mockReturnValue({ ...baseContext, apy: undefined });
    render(<YieldDetails />);
    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('displays APY with correct formatting', () => {
    render(<YieldDetails />);
    expect(screen.getByTestId('ock-yieldDetails')).toHaveTextContent(
      'APY 5.00%',
    );
  });

  it('opens popover when info button is clicked', () => {
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnNativeApy')).toBeInTheDocument();
  });

  it('displays native APY in popover', () => {
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnNativeApy')).toHaveTextContent('5.00%');
  });

  it('displays rewards in popover', () => {
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnRewards')).toHaveTextContent(
      'REWARD2.00%',
    );
  });

  it('handles empty rewards array', () => {
    mockUseEarnContext.mockReturnValue({
      ...baseContext,
      rewards: [],
    });
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.queryByTestId('ock-earnRewards')).not.toBeInTheDocument();
  });

  it('handles null rewards', () => {
    mockUseEarnContext.mockReturnValue({
      ...baseContext,
      rewards: null,
    });
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.queryByTestId('ock-earnRewards')).not.toBeInTheDocument();
  });

  it('displays performance fee in popover', () => {
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnPerformanceFee')).toHaveTextContent(
      'Perf. Fee (1%)',
    );
    expect(screen.getByTestId('ock-earnPerformanceFee')).toHaveTextContent(
      '-0.05%',
    );
  });

  it('closes popover when onClose is triggered', () => {
    render(<YieldDetails />);
    // Open the popover first
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnNativeApy')).toBeInTheDocument();

    // Trigger onClose (simulating clicking outside or pressing escape)
    const popover = screen.getByRole('dialog');
    fireEvent.keyDown(popover, { key: 'Escape' });

    // Verify popover is closed
    expect(screen.queryByTestId('ock-earnNativeApy')).not.toBeInTheDocument();
  });

  it('handles missing native APY gracefully', () => {
    mockUseEarnContext.mockReturnValue({
      ...baseContext,
      nativeApy: undefined,
    });
    render(<YieldDetails />);

    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.queryByTestId('ock-earnNativeApy')).not.toBeInTheDocument();
  });

  it('handles cases where vault fees are falsey', () => {
    mockUseEarnContext.mockReturnValue({
      ...baseContext,
      vaultFee: undefined,
    });
    render(<YieldDetails />);

    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(
      screen.queryByTestId('ock-earnPerformanceFee'),
    ).not.toBeInTheDocument();
  });
});
