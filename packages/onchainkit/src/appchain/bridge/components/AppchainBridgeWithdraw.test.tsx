import { Spinner } from '@/internal/components/Spinner';
import { pressable } from '@/styles/theme';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWithdrawButton } from '../hooks/useWithdrawButton';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';
import { AppchainBridgeWithdraw } from './AppchainBridgeWithdraw';

vi.mock('./AppchainBridgeProvider', () => ({
  useAppchainBridgeContext: vi.fn(),
}));

vi.mock('../hooks/useWithdrawButton', () => ({
  useWithdrawButton: vi.fn(),
}));

describe('AppchainBridgeWithdraw', () => {
  const mockSetIsWithdrawModalOpen = vi.fn();
  const mockSetIsSuccessModalOpen = vi.fn();
  const mockWaitForWithdrawal = vi.fn();
  const mockProveAndFinalizeWithdrawal = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    (useAppchainBridgeContext as Mock).mockReturnValue({
      withdrawStatus: 'init',
      waitForWithdrawal: mockWaitForWithdrawal,
      proveAndFinalizeWithdrawal: mockProveAndFinalizeWithdrawal,
      setIsWithdrawModalOpen: mockSetIsWithdrawModalOpen,
      setIsSuccessModalOpen: mockSetIsSuccessModalOpen,
    });

    (useWithdrawButton as Mock).mockReturnValue({
      isSuccess: false,
      buttonDisabled: false,
      buttonContent: 'Claim',
      shouldShowClaim: false,
      label: 'Withdraw',
    });
  });

  it('renders the loading state correctly', () => {
    (useWithdrawButton as Mock).mockReturnValue({
      isPending: true,
      isSuccess: false,
      buttonDisabled: false,
      buttonContent: 'Claim',
      shouldShowClaim: false,
      label: 'Withdraw',
    });

    render(<AppchainBridgeWithdraw />);

    expect(screen.getByText('Withdraw')).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes('Waiting for claim to be ready...'),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes('Please do not close this window.'),
      ),
    ).toBeInTheDocument();
  });

  it('renders the claim state correctly', () => {
    (useWithdrawButton as Mock).mockReturnValue({
      isSuccess: false,
      buttonDisabled: false,
      buttonContent: 'Claim Funds',
      shouldShowClaim: true,
      label: 'Claim',
    });

    render(<AppchainBridgeWithdraw />);

    const claimButton = screen.getByText('Claim Funds');
    expect(claimButton).toBeInTheDocument();

    fireEvent.click(claimButton);
    expect(mockProveAndFinalizeWithdrawal).toHaveBeenCalledTimes(1);
  });

  it('renders the error state correctly', () => {
    (useWithdrawButton as Mock).mockReturnValue({
      isError: true,
    });

    render(<AppchainBridgeWithdraw />);

    expect(
      screen.getByText((content) =>
        content.includes('There was an error processing your withdrawal.'),
      ),
    ).toBeInTheDocument();
  });

  it('shows error message when claim is rejected', () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      withdrawStatus: 'claimRejected',
      waitForWithdrawal: mockWaitForWithdrawal,
      proveAndFinalizeWithdrawal: mockProveAndFinalizeWithdrawal,
      setIsWithdrawModalOpen: mockSetIsWithdrawModalOpen,
    });

    render(<AppchainBridgeWithdraw />);

    expect(screen.getByText('Transaction denied')).toBeInTheDocument();
  });

  it('calls waitForWithdrawal when withdrawStatus changes to withdrawSuccess', () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      withdrawStatus: 'withdrawSuccess',
      waitForWithdrawal: mockWaitForWithdrawal,
      proveAndFinalizeWithdrawal: mockProveAndFinalizeWithdrawal,
      setIsWithdrawModalOpen: mockSetIsWithdrawModalOpen,
    });

    render(<AppchainBridgeWithdraw />);

    expect(mockWaitForWithdrawal).toHaveBeenCalled();
  });

  it('calls waitForWithdrawal with resumeWithdrawalTxHash when resumeWithdrawalTxHash is set', () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      resumeWithdrawalTxHash: '0x123',
      waitForWithdrawal: mockWaitForWithdrawal,
    });

    render(<AppchainBridgeWithdraw />);

    expect(mockWaitForWithdrawal).toHaveBeenCalledWith('0x123');
  });

  it('disables claim button when buttonDisabled is true', () => {
    (useWithdrawButton as Mock).mockReturnValue({
      isSuccess: false,
      buttonDisabled: true,
      buttonContent: <Spinner />,
      shouldShowClaim: true,
      label: 'Claim',
    });

    render(<AppchainBridgeWithdraw />);

    const claimButton = screen.getByRole('button');
    expect(claimButton).toHaveClass(pressable.disabled);
  });
});
