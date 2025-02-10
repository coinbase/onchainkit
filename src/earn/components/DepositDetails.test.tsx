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

    const trigger = screen.getByTestId('ock-apyInfoButton');
    fireEvent.click(trigger);
    expect(screen.getByTestId('ock-earnNativeApy')).toBeInTheDocument();
  });

  it('does not render native APY when value is undefined', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      nativeApy: undefined,
    });

    render(<DepositDetails />);
    const trigger = screen.getByTestId('ock-apyInfoButton');
    fireEvent.click(trigger);
    expect(screen.queryByTestId('ock-earnNativeApy')).not.toBeInTheDocument();
  });

  it('renders rewards when value is provided', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      rewards: [{ assetName: 'MORPHO', apy: 0.05, asset: '0x123' as Address }],
    });

    render(<DepositDetails />);
    const trigger = screen.getByTestId('ock-apyInfoButton');
    fireEvent.click(trigger);
    expect(screen.getByTestId('ock-earnRewards')).toBeInTheDocument();
  });

  it('does not render rewards when value is undefined', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      rewards: undefined,
    });

    render(<DepositDetails />);
    expect(screen.queryByTestId('ock-earnRewards')).not.toBeInTheDocument();
  });

  it('renders performance fee when value is provided', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      vaultFee: 0.01,
    });

    render(<DepositDetails />);
    const trigger = screen.getByTestId('ock-apyInfoButton');

    fireEvent.click(trigger);

    expect(screen.getByTestId('ock-earnPerformanceFee')).toBeInTheDocument();
  });

  it('does not render performance fee when value is falsey', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      vaultFee: 0,
    });

    render(<DepositDetails />);
    const trigger = screen.getByTestId('ock-apyInfoButton');
    fireEvent.click(trigger);
    expect(
      screen.queryByTestId('ock-earnPerformanceFee'),
    ).not.toBeInTheDocument();
  });

  // Popover tests
  it('toggles popover visibility when info button is clicked', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      apy: 0.05,
    });

    render(<DepositDetails />);

    const infoButton = screen.getByTestId('ock-apyInfoButton');

    // Initial state - popover should be open (isOpen defaults to false)
    expect(screen.queryByTestId('ock-earnNativeApy')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(infoButton);
    expect(screen.getByTestId('ock-earnNativeApy')).toBeInTheDocument();

    // Click to close
    fireEvent.click(infoButton);
    expect(screen.queryByTestId('ock-earnNativeApy')).not.toBeInTheDocument();
  });

  it('closes popover when onClose is triggered', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...baseContext,
      apy: 0.05,
      nativeApy: 0.05,
    });

    render(<DepositDetails />);

    const trigger = screen.getByTestId('ock-apyInfoButton');

    // Initial state - popover should not be open
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByTestId('ock-earnNativeApy')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(trigger);
    expect(screen.getByTestId('ock-earnNativeApy')).toBeInTheDocument();

    // Trigger onClose
    const popover = screen.getByRole('dialog');
    fireEvent.keyDown(popover, { key: 'Escape' });

    expect(screen.queryByTestId('ock-earnNativeApy')).not.toBeInTheDocument();
  });
});
