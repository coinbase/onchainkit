import { render, screen } from '@testing-library/react';
import { usdcToken } from '@/token/constants';
import type { Address } from 'viem';
import { type Mock, describe, it, expect, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { WithdrawDetails } from './WithdrawDetails';

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
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

describe('WithdrawDetails Component', () => {
  it('renders EarnDetails with interest earned when interest is provided', () => {
    const mockInterest = '1.2k';
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      interest: mockInterest,
    });

    const { container } = render(<WithdrawDetails />);

    const tokenElement = screen.getByTestId('ockTokenChip_Button');
    expect(tokenElement).toHaveTextContent(usdcToken.name);

    expect(container).toHaveTextContent(`${mockInterest} interest earned`);
  });

  it('renders EarnDetails with an empty tag when interest is not provided', () => {
    vi.mocked(useEarnContext).mockReturnValue({ ...baseContext, apy: '' });

    render(<WithdrawDetails />);

    const tokenElement = screen.getByTestId('ockTokenChip_Button');
    expect(tokenElement).toHaveTextContent(usdcToken.name);
  });

  it('applies custom className to the EarnDetails container', () => {
    const customClass = 'custom-class';
    (useEarnContext as Mock).mockReturnValue({ apy: null });

    render(<WithdrawDetails className={customClass} />);

    const earnDetails = screen.getByTestId('ockEarnDetails');
    expect(earnDetails).toHaveClass(customClass);
  });
});
