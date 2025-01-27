import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EarnDeposit } from './EarnDeposit';
import { useEarnContext } from './EarnProvider';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
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
  apy: '5%',
};

describe('EarnDeposit Component', () => {
  beforeEach(() => {
    vi.mocked(useEarnContext).mockReturnValue(baseContext);
  });

  it('renders children when provided', () => {
    const mockChildren = <p>Custom Children</p>;
    render(<EarnDeposit>{mockChildren}</EarnDeposit>);

    const earnCard = screen.getByTestId('ockEarnCard');
    expect(earnCard).toBeInTheDocument();
    expect(earnCard).toHaveTextContent('Custom Children');
  });

  it('renders default components when children are not provided', () => {
    render(<EarnDeposit />);

    const earnCard = screen.getByTestId('ockEarnCard');
    expect(earnCard).toBeInTheDocument();

    expect(screen.getByTestId('ockEarnDetails')).toBeInTheDocument();
    expect(screen.getByTestId('ockEarnAmountInput')).toBeInTheDocument();
    expect(screen.getByTestId('ockEarnBalance')).toBeInTheDocument();
  });

  it('applies custom className to the EarnCard', () => {
    const customClass = 'custom-class';
    render(<EarnDeposit className={customClass} />);

    const earnCard = screen.getByTestId('ockEarnCard');
    expect(earnCard).toHaveClass(customClass);
  });
});
