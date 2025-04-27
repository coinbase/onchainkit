import { renderHook } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useWithdrawButton } from './useWithdrawButton';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

describe('useWithdrawButton', () => {
  const mockProps = {
    withdrawStatus: 'idle',
  };

  it('should return initial state when status is idle', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
    });

    const { result } = renderHook(() => useWithdrawButton(mockProps));

    expect(result.current).toEqual({
      isPending: false,
      isSuccess: false,
      isError: false,
      buttonDisabled: false,
      buttonContent: 'Claim',
      shouldShowClaim: false,
      label: 'Confirming transaction',
    });
  });

  it('should show pending state when status is withdrawSuccess', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
    });

    const { result } = renderHook(() =>
      useWithdrawButton({ withdrawStatus: 'withdrawSuccess' }),
    );

    expect(result.current).toEqual({
      isPending: true,
      isSuccess: false,
      isError: false,
      buttonDisabled: true,
      buttonContent: expect.any(Object),
      shouldShowClaim: false,
      label: 'Confirming transaction',
    });
  });

  it('should show success state when status is claimSuccess', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
    });

    const { result } = renderHook(() =>
      useWithdrawButton({ withdrawStatus: 'claimSuccess' }),
    );

    expect(result.current).toEqual({
      isPending: false,
      isSuccess: true,
      isError: false,
      buttonDisabled: false,
      buttonContent: 'Claim',
      shouldShowClaim: false,
      label: 'Transaction complete',
    });
  });

  it('should show claim ready state when status is claimReady', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
    });

    const { result } = renderHook(() =>
      useWithdrawButton({ withdrawStatus: 'claimReady' }),
    );

    expect(result.current).toEqual({
      isPending: false,
      isSuccess: false,
      isError: false,
      buttonDisabled: false,
      buttonContent: 'Claim',
      shouldShowClaim: true,
      label: 'Claim is ready',
    });
  });

  it('should show claim rejected state when status is claimRejected', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
    });

    const { result } = renderHook(() =>
      useWithdrawButton({ withdrawStatus: 'claimRejected' }),
    );

    expect(result.current).toEqual({
      isPending: false,
      isSuccess: false,
      isError: false,
      buttonDisabled: false,
      buttonContent: 'Claim',
      shouldShowClaim: true,
      label: 'Claim is ready',
    });
  });

  it('should show error state when status is error', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
    });

    const { result } = renderHook(() =>
      useWithdrawButton({ withdrawStatus: 'error' }),
    );

    expect(result.current).toEqual({
      isPending: false,
      isSuccess: false,
      isError: true,
      buttonDisabled: false,
      buttonContent: 'Claim',
      shouldShowClaim: false,
      label: 'Error processing withdrawal',
    });
  });

  it('should handle unknown status gracefully', () => {
    (useAccount as Mock).mockReturnValue({
      isConnected: true,
    });

    const { result } = renderHook(() =>
      useWithdrawButton({ withdrawStatus: 'unknown' }),
    );

    expect(result.current).toEqual({
      isPending: false,
      isSuccess: false,
      isError: false,
      buttonDisabled: false,
      buttonContent: 'Claim',
      shouldShowClaim: false,
      label: 'Confirming transaction',
    });
  });
});
