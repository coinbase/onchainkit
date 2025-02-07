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
import { DepositBalance } from './DepositBalance';
import { useEarnContext } from './EarnProvider';
import type { EarnContextType } from '@/earn/types';
import { useAccount } from 'wagmi';

const baseContext: EarnContextType = {
  underlyingBalance: '1000',
  underlyingBalanceStatus: 'success',
  setDepositAmount: vi.fn(),
  vaultAddress: '0x123' as Address,
  depositAmount: '0',
  receiptBalance: '0',
  receiptBalanceStatus: 'success',
  withdrawAmount: '0',
  setWithdrawAmount: vi.fn(),
  depositCalls: [],
  withdrawCalls: [],
  vaultToken: usdcToken,
  lifecycleStatus: { statusName: 'init', statusData: null } as const,
  updateLifecycleStatus: vi.fn(),
};

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn().mockReturnValue({
    address: '0x123' as Address,
  }),
}));

describe('DepositBalance', () => {
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

  it('renders the converted balance and subtitle correctly', () => {
    vi.mocked(useEarnContext).mockReturnValue(baseContext);

    render(<DepositBalance className="test-class" />);

    expect(screen.getByText('1,000 USDC')).toBeInTheDocument();
    expect(screen.getByText('Available to deposit')).toBeInTheDocument();
  });

  it('calls setDepositAmount with underlyingBalance when the action button is clicked', () => {
    const mockSetDepositAmount = vi.fn();
    const mockContext: EarnContextType = {
      ...baseContext,
      underlyingBalance: '1000',
      setDepositAmount: mockSetDepositAmount,
    };

    vi.mocked(useEarnContext).mockReturnValue(mockContext);

    render(<DepositBalance className="test-class" />);

    const actionButton = screen.getByText('Use max');
    fireEvent.click(actionButton);

    expect(mockSetDepositAmount).toHaveBeenCalledWith('1000');
  });

  it('does not render the action button when underlyingBalance is blank', () => {
    const mockContext: EarnContextType = {
      ...baseContext,
      underlyingBalance: '',
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
