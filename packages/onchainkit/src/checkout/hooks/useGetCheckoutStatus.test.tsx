import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCheckoutContext } from '../components/CheckoutProvider';
import { useGetCheckoutStatus } from './useGetCheckoutStatus';
import { CHECKOUT_LIFECYCLE_STATUS } from '../constants';

vi.mock('../components/CheckoutProvider', () => ({
  useCheckoutContext: vi.fn(),
}));

describe('useGetCheckoutStatus', () => {
  it('should return pending status', () => {
    vi.mocked(useCheckoutContext).mockReturnValue({
      errorMessage: '',
      lifecycleStatus: {
        statusName: CHECKOUT_LIFECYCLE_STATUS.PENDING,
        statusData: {},
      },
      onSubmit: vi.fn(),
      updateLifecycleStatus: vi.fn(),
    });
    const { result } = renderHook(() => useGetCheckoutStatus());
    expect(result.current).toEqual({
      label: 'Payment in progress...',
      labelClassName: 'text-ock-foreground-muted',
    });
  });

  it('should return success status', () => {
    vi.mocked(useCheckoutContext).mockReturnValue({
      errorMessage: '',
      lifecycleStatus: {
        statusName: CHECKOUT_LIFECYCLE_STATUS.SUCCESS,
        statusData: {
          transactionReceipts: [],
          chargeId: '',
          receiptUrl: '',
        },
      },
      onSubmit: vi.fn(),
      updateLifecycleStatus: vi.fn(),
    });
    const { result } = renderHook(() => useGetCheckoutStatus());
    expect(result.current).toEqual({
      label: 'Payment successful!',
      labelClassName: 'text-ock-success',
    });
  });

  it('should return error status', () => {
    vi.mocked(useCheckoutContext).mockReturnValue({
      errorMessage: 'Payment failed',
      lifecycleStatus: {
        statusName: CHECKOUT_LIFECYCLE_STATUS.ERROR,
        statusData: {
          code: 'PmUWCSh01',
          error: 'Payment failed',
          message: 'Payment failed',
        },
      },
      onSubmit: vi.fn(),
      updateLifecycleStatus: vi.fn(),
    });
    const { result } = renderHook(() => useGetCheckoutStatus());
    expect(result.current).toEqual({
      label: 'Payment failed',
      labelClassName: 'text-ock-error',
    });
  });
});
