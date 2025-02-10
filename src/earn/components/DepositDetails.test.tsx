import type { EarnContextType } from '@/earn/types';
import { usdcToken } from '@/token/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { DepositDetails } from './DepositDetails';
import { useEarnContext } from './EarnProvider';

const baseContext: EarnContextType = {
  underlyingBalance: '1000',
  underlyingBalanceStatus: 'success',
  setDepositAmount: vi.fn(),
  vaultAddress: '0x123' as Address,
  depositAmount: '0',
  receiptBalance: '0',
  receiptBalanceStatus: 'success',
  setWithdrawAmount: vi.fn(),
  depositCalls: [],
  withdrawCalls: [],
  vaultToken: usdcToken,
  lifecycleStatus: { statusName: 'init', statusData: null },
  updateLifecycleStatus: vi.fn(),
  withdrawAmount: '0',
  refetchUnderlyingBalance: vi.fn(),
  refetchReceiptBalance: vi.fn(),
  depositAmountError: null,
  withdrawAmountError: null,
  apy: 0.05,
  nativeApy: 0.05,
  vaultFee: 0.01,
  rewards: [],
};
vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('DepositDetails Component', () => {
  it('renders EarnDetails with default APY tag when APY is provided', () => {
    const mockApy = 5;
    vi.mocked(useEarnContext).mockReturnValue({ ...baseContext, apy: mockApy });

    const { container } = render(<DepositDetails />);

    const tokenElement = screen.getByTestId('ockTokenChip_Button');
    expect(tokenElement).toHaveTextContent(usdcToken.name);

    expect(container).toHaveTextContent(`APY ${mockApy}`);
  });

  it('renders EarnDetails with an empty tag when APY is not provided', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      apy: undefined,
    });

    render(<DepositDetails />);

    const tokenElement = screen.getByTestId('ockTokenChip_Button');
    expect(tokenElement).toHaveTextContent(usdcToken.name);
  });

  it('applies custom className to the EarnDetails container', () => {
    const customClass = 'custom-class';
    (useEarnContext as Mock).mockReturnValue({ apy: undefined });

    render(<DepositDetails className={customClass} />);

    const earnDetails = screen.getByTestId('ockEarnDetails');
    expect(earnDetails).toHaveClass(customClass);
  });

  it('renders native APY when value is provided', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      nativeApy: 0.05,
    });

    render(<DepositDetails />);
    expect(screen.getByTestId('ock-nativeApy')).toBeInTheDocument();
  });

  it('does not render native APY when value is undefined', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      nativeApy: undefined,
    });

    render(<DepositDetails />);
    expect(screen.queryByTestId('ock-nativeApy')).not.toBeInTheDocument();
  });

  it('renders rewards when value is provided', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      rewards: [{ assetName: 'MORPHO', apy: 0.05, asset: '0x123' as Address }],
    });

    render(<DepositDetails />);
    expect(screen.getByTestId('ock-rewards')).toBeInTheDocument();
  });

  it('does not render rewards when value is undefined', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      rewards: undefined,
    });

    render(<DepositDetails />);
    expect(screen.queryByTestId('ock-rewards')).not.toBeInTheDocument();
  });

  it('renders performance fee when value is provided', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      vaultFee: 0.01,
    });

    render(<DepositDetails />);
    expect(screen.getByTestId('ock-performanceFee')).toBeInTheDocument();
  });

  it('does not render performance fee when value is falsey', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      vaultFee: 0,
    });
  });

  // Popover tests
  it('toggles popover visibility when info button is clicked', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      apy: 0.05,
    });

    render(<DepositDetails />);

    const infoButton = screen.getByTestId('ock-apyInfoButton');

    // Initial state - popover should be open (isOpen defaults to true)
    expect(screen.getByTestId('ock-nativeApy')).toBeInTheDocument();

    // Click to close
    fireEvent.click(infoButton);
    expect(screen.queryByTestId('ock-nativeApy')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(infoButton);
    expect(screen.getByTestId('ock-nativeApy')).toBeInTheDocument();
  });

  it('closes popover when onClose is triggered', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      apy: 0.05,
    });

    render(<DepositDetails />);

    // Initial state - popover should be open
    expect(screen.getByTestId('ock-nativeApy')).toBeInTheDocument();

    // Trigger onClose
    const popover = screen.getByRole('dialog');
    fireEvent.keyDown(popover, { key: 'Escape' });

    expect(screen.queryByTestId('ock-nativeApy')).not.toBeInTheDocument();
  });
});
