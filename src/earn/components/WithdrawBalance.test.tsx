import type { EarnContextType } from '@/earn/types';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { WithdrawBalance } from './WithdrawBalance';
import { usdcToken } from '@/token/constants';

const baseContext: EarnContextType = {
  convertedBalance: '1000',
  setDepositAmount: vi.fn(),
  vaultAddress: '0x123' as Address,
  depositAmount: '0',
  depositedAmount: '1000',
  withdrawAmount: '0',
  setWithdrawAmount: vi.fn(),
  depositCalls: [],
  withdrawCalls: [],
  vaultToken: usdcToken,
};

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

describe('WithdrawBalance', () => {
  it('renders the converted balance and subtitle correctly', () => {
    vi.mocked(useEarnContext).mockReturnValue(baseContext);

    render(<WithdrawBalance />);

    expect(screen.getByText('1,000 USDC')).toBeInTheDocument();
    expect(screen.getByText('Available to withdraw')).toBeInTheDocument();
  });

  it('calls setWithdrawAmount with convertedBalance when the action button is clicked', () => {
    const mocksetWithdrawAmount = vi.fn();
    const mockContext = {
      ...baseContext,
      depositedAmount: '1000',
      setWithdrawAmount: mocksetWithdrawAmount,
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<WithdrawBalance />);

    const actionButton = screen.getByText('Use max');
    fireEvent.click(actionButton);

    expect(mocksetWithdrawAmount).toHaveBeenCalledWith('1000');
  });

  it('does not render the action button when convertedBalance is null', () => {
    const mockContext = {
      ...baseContext,
      depositedAmount: '',
      setWithdrawAmount: vi.fn(),
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<WithdrawBalance className="test-class" />);

    expect(screen.queryByText('Use max')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const mockContext = {
      ...baseContext,
      depositedAmount: '1000',
      setWithdrawAmount: vi.fn(),
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<WithdrawBalance className="custom-class" />);

    const container = screen.getByTestId('ockEarnBalance');
    expect(container).toHaveClass('custom-class');
  });
});
