import type { EarnContextType } from '@/earn/types';
import { usdcToken } from '@/token/constants';
import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { WithdrawDetails } from './WithdrawDetails';

const baseContext: EarnContextType = {
  convertedBalance: '1000',
  setDepositAmount: vi.fn(),
  vaultAddress: '0x123' as Address,
  depositAmount: '0',
  depositedAmount: '0',
  withdrawAmount: '0',
  setWithdrawAmount: vi.fn(),
  depositCalls: [],
  withdrawCalls: [],
  vaultToken: usdcToken,
};

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

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
    vi.mocked(useEarnContext).mockReturnValue({ ...baseContext });

    render(<WithdrawDetails />);

    const tokenElement = screen.getByTestId('ockTokenChip_Button');
    expect(tokenElement).toHaveTextContent(usdcToken.name);
  });

  it('applies custom className to the EarnDetails container', () => {
    const customClass = 'custom-class';
    (useEarnContext as Mock).mockReturnValue(baseContext);

    render(<WithdrawDetails className={customClass} />);

    const earnDetails = screen.getByTestId('ockEarnDetails');
    expect(earnDetails).toHaveClass(customClass);
  });
});
