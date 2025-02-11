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

const baseContext: EarnContextType = {
  underlyingBalance: '1000',
  underlyingBalanceStatus: 'success',
  setDepositAmount: vi.fn(),
  vaultAddress: '0x123' as Address,
  depositAmount: '0',
  receiptBalance: '1000',
  receiptBalanceStatus: 'success',
  withdrawAmount: '0',
  setWithdrawAmount: vi.fn(),
  depositCalls: [],
  withdrawCalls: [],
  vaultToken: usdcToken,
  lifecycleStatus: { statusName: 'init', statusData: null },
  updateLifecycleStatus: vi.fn(),
  refetchUnderlyingBalance: vi.fn(),
  refetchReceiptBalance: vi.fn(),
  depositAmountError: null,
  withdrawAmountError: null,
  apy: 0,
  nativeApy: 0,
  vaultFee: 0,
  rewards: [],
  vaultName: 'Test Vault',
  deposits: '1000',
  liquidity: '1000',
};

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
    vi.mocked(useEarnContext).mockReturnValue(baseContext);
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
      ...baseContext,
      receiptBalanceStatus: 'pending',
    });

    render(<WithdrawBalance />);

    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
    expect(screen.getByText(usdcToken.symbol)).toBeInTheDocument();
  });

  it('renders a Skeleton when vaultToken is undefined', () => {
    const mockContext: EarnContextType = {
      ...baseContext,
      vaultToken: undefined,
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<WithdrawBalance />);

    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('renders the receipt token balance and subtitle correctly', () => {
    vi.mocked(useEarnContext).mockReturnValue(baseContext);

    render(<WithdrawBalance />);

    expect(screen.getByText('1,000 USDC')).toBeInTheDocument();
    expect(screen.getByText('Available to withdraw')).toBeInTheDocument();
  });

  it('calls setWithdrawAmount with receiptBalance when the action button is clicked', () => {
    const mocksetWithdrawAmount = vi.fn();
    const mockContext: EarnContextType = {
      ...baseContext,
      receiptBalance: '1000',
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
      ...baseContext,
      receiptBalance: '',
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
