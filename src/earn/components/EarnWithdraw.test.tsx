import type { Call } from '@/transaction/types';
import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { EarnWithdraw } from './EarnWithdraw';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

const baseContext = {
  convertedBalance: '1000',
  setDepositAmount: vi.fn(),
  vaultAddress: '0x123' as Address,
  depositAmount: '0',
  depositedAmount: '0',
  withdrawAmount: '0',
  setWithdrawAmount: vi.fn(),
  interest: '1.2k',
  depositCalls: [],
  withdrawCalls: [],
};

vi.mock('@/transaction', () => ({
  Transaction: ({
    className,
    calls,
    children,
  }: { className: string; calls: Call[]; children: React.ReactNode }) => (
    <div
      data-testid="transaction"
      className={className}
      data-calls={JSON.stringify(calls)}
    >
      {children}
    </div>
  ),
  TransactionButton: ({ text }: { text: string }) => (
    <button data-testid="transaction-button">{text}</button>
  ),
}));

describe('EarnWithdraw Component', () => {
  beforeEach(() => {
    vi.mocked(useEarnContext).mockReturnValue(baseContext);
  });

  it('renders children when provided', () => {
    const mockChildren = <p>Custom Children</p>;
    render(<EarnWithdraw>{mockChildren}</EarnWithdraw>);

    const earnCard = screen.getByTestId('ockEarnCard');
    expect(earnCard).toBeInTheDocument();
    expect(earnCard).toHaveTextContent('Custom Children');
  });

  it('renders default components when children are not provided', () => {
    render(<EarnWithdraw />);

    const earnCard = screen.getByTestId('ockEarnCard');
    expect(earnCard).toBeInTheDocument();

    expect(screen.getByTestId('ockEarnDetails')).toBeInTheDocument();
    expect(screen.getByTestId('ockEarnAmountInput')).toBeInTheDocument();
    expect(screen.getByTestId('ockEarnBalance')).toBeInTheDocument();
  });

  it('applies custom className to the EarnCard', () => {
    const customClass = 'custom-class';
    render(<EarnWithdraw className={customClass} />);

    const earnCard = screen.getByTestId('ockEarnCard');
    expect(earnCard).toHaveClass(customClass);
  });
});
