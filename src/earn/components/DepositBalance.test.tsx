import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DepositBalance } from './DepositBalance';
import { useEarnContext } from './EarnProvider';
import type { Address } from 'viem';

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
};

describe('DepositBalance', () => {
  it('renders the converted balance and subtitle correctly', () => {
    vi.mocked(useEarnContext).mockReturnValue(baseContext);

    render(<DepositBalance className="test-class" />);

    expect(screen.getByText('1000 USDC')).toBeInTheDocument();
    expect(screen.getByText('Available to deposit')).toBeInTheDocument();
  });

  it('calls setDepositAmount with convertedBalance when the action button is clicked', () => {
    const mockSetDepositAmount = vi.fn();
    const mockContext = {
      ...baseContext,
      convertedBalance: '1000',
      setDepositAmount: mockSetDepositAmount,
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<DepositBalance className="test-class" />);

    const actionButton = screen.getByText('Use max');
    fireEvent.click(actionButton);

    expect(mockSetDepositAmount).toHaveBeenCalledWith('1000');
  });

  it('does not render the action button when convertedBalance is null', () => {
    const mockContext = {
      ...baseContext,
      convertedBalance: '',
      setDepositAmount: vi.fn(),
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<DepositBalance className="test-class" />);

    expect(screen.queryByText('Use max')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const mockContext = {
      ...baseContext,
      convertedBalance: '1000',
      setDepositAmount: vi.fn(),
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<DepositBalance className="custom-class" />);

    const container = screen.getByTestId('ockEarnBalance');
    expect(container).toHaveClass('custom-class');
  });
});
