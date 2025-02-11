import type { EarnContextType } from '@/earn/types';
import { usdcToken } from '@/token/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { beforeEach, describe, expect, it } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { VaultDetails } from './VaultDetails';

const baseContext: EarnContextType = {
  vaultToken: usdcToken,
  vaultName: 'Test Vault',
  deposits: '10000', // 1 TOKEN in wei
  liquidity: '2000', // 2 TOKEN in wei
  vaultAddress: '0x1234567890123456789012345678901234567890',
  underlyingBalance: '1000000000000000000', // 1 TOKEN in wei
  underlyingBalanceStatus: 'success',
  refetchUnderlyingBalance: vi.fn(),
  apy: 0.05,
  nativeApy: 0.05,
  vaultFee: 0.01,
  rewards: [],
  receiptBalance: '0',
  receiptBalanceStatus: 'success',
  setDepositAmount: vi.fn(),
  depositAmount: '0',
  withdrawAmount: '0',
  setWithdrawAmount: vi.fn(),
  depositCalls: [],
  withdrawCalls: [],
  lifecycleStatus: { statusName: 'init', statusData: null },
  updateLifecycleStatus: vi.fn(),
  depositAmountError: null,
  withdrawAmountError: null,
  refetchReceiptBalance: vi.fn(),
};

// Mock the context hook
vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('VaultDetails', () => {
  beforeEach(() => {
    // Reset mock before each test
    vi.mocked(useEarnContext).mockReturnValue(baseContext);
  });

  it('renders skeleton when vault data is not available', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      // @ts-expect-error - This is a test
      vaultToken: null,
      // @ts-expect-error - This is a test
      vaultName: null,
    });

    render(<VaultDetails />);
    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('renders vault details with correct initial state', () => {
    render(<VaultDetails />);

    expect(screen.getByTestId('ock-vaultDetails')).toBeInTheDocument();
    expect(screen.getByTestId('ock-vaultDetailsButton')).toBeInTheDocument();
  });

  it('closes popover when onClose is triggered', () => {
    render(<VaultDetails />);

    fireEvent.click(screen.getByTestId('ock-vaultDetailsButton'));
    expect(screen.getByTestId('ock-vaultDetails')).toBeInTheDocument();

    const popover = screen.getByRole('dialog');
    fireEvent.keyDown(popover, { key: 'Escape' });

    expect(
      screen.queryByTestId('ock-vaultDetailsBaseScanLink'),
    ).not.toBeInTheDocument();
  });

  it('displays correct token information in popover', () => {
    render(<VaultDetails />);

    fireEvent.click(screen.getByTestId('ock-vaultDetailsButton'));

    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('10K USDC')).toBeInTheDocument(); // Deposits
    expect(screen.getByText('2K USDC')).toBeInTheDocument(); // Liquidity
  });

  it('renders BaseScan link with correct address', () => {
    render(<VaultDetails />);

    fireEvent.click(screen.getByTestId('ock-vaultDetailsButton'));

    const baseScanLink = screen.getByTestId('ock-vaultDetailsBaseScanLink');
    expect(baseScanLink).toHaveAttribute(
      'href',
      'https://basescan.org/address/0x1234567890123456789012345678901234567890',
    );
    expect(baseScanLink).toHaveAttribute('target', '_blank');
    expect(baseScanLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles missing optional data gracefully', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      // @ts-expect-error - This is a test
      deposits: null,
      // @ts-expect-error - This is a test
      liquidity: null,
    });

    render(<VaultDetails />);

    fireEvent.click(screen.getByTestId('ock-vaultDetailsButton'));

    expect(screen.queryByText('Total deposits')).not.toBeInTheDocument();
    expect(screen.queryByText('Liquidity')).not.toBeInTheDocument();
  });
});
