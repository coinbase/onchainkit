import { MOCK_EARN_CONTEXT } from '@/earn/mocks/mocks.test';
import type { EarnContextType } from '@/earn/types';
import { usdcToken } from '@/token/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useAccount } from 'wagmi';
import { useEarnContext } from './EarnProvider';
import { WithdrawBalance } from './WithdrawBalance';

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn().mockReturnValue({
    address: '0x123' as Address,
  }),
}));

describe('WithdrawBalance', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useEarnContext).mockReturnValue(MOCK_EARN_CONTEXT);
    vi.mocked(useAccount as Mock).mockReturnValue({
      address: '0x123' as Address,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders 'Wallet not connected' when the user is not connected", () => {
    vi.mocked(useAccount as Mock).mockReturnValue({
      address: undefined,
    });

    render(<WithdrawBalance />);

    expect(screen.getByText('Wallet not connected')).toBeInTheDocument();
  });

  it('renders a skeleton for the amount and shows the token symbol when the balance is pending', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      depositedBalanceStatus: 'pending',
    });

    render(<WithdrawBalance />);

    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
    expect(screen.getByText(usdcToken.symbol)).toBeInTheDocument();
  });

  it('renders a Skeleton when vaultToken is undefined', () => {
    const mockContext: EarnContextType = {
      ...MOCK_EARN_CONTEXT,
      vaultToken: undefined,
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<WithdrawBalance />);

    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('renders the receipt token balance and subtitle correctly', () => {
    vi.mocked(useEarnContext).mockReturnValue(MOCK_EARN_CONTEXT);

    render(<WithdrawBalance />);

    expect(screen.getByText('1,000 USDC')).toBeInTheDocument();
    expect(screen.getByText('Available to withdraw')).toBeInTheDocument();
  });

  it('calls setWithdrawAmount with receiptBalance when the action button is clicked', () => {
    const mocksetWithdrawAmount = vi.fn();
    const mockContext: EarnContextType = {
      ...MOCK_EARN_CONTEXT,
      depositedBalance: '1000',
      setWithdrawAmount: mocksetWithdrawAmount,
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<WithdrawBalance />);

    const actionButton = screen.getByText('Use max');
    fireEvent.click(actionButton);

    expect(mocksetWithdrawAmount).toHaveBeenCalledWith('1000');
  });

  it('does not render the action button when receiptBalance is blank', () => {
    const mockContext: EarnContextType = {
      ...MOCK_EARN_CONTEXT,
      depositedBalance: '',
      setWithdrawAmount: vi.fn(),
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<WithdrawBalance className="test-class" />);

    expect(screen.queryByText('Use max')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const mockContext: EarnContextType = {
      ...MOCK_EARN_CONTEXT,
      depositedBalance: '1000',
      setWithdrawAmount: vi.fn(),
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<WithdrawBalance className="custom-class" />);

    const container = screen.getByTestId('ockEarnBalance');
    expect(container).toHaveClass('custom-class');
  });
});
