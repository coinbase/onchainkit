import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCheckoutContext } from '../components/CheckoutProvider';
import { CHECKOUT_LIFECYCLESTATUS } from '../constants';
import { useGetCheckoutStatus } from './useGetCheckoutStatus';

vi.mock('../components/CheckoutProvider', () => ({
  useCheckoutContext: vi.fn(),
}));

describe('useGetCheckoutStatus', () => {
  it('should return pending status', () => {
    vi.mocked(useCheckoutContext).mockReturnValue({
      errorMessage: '',
      lifecycleStatus: {
        statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
        statusData: {},
      },
      onSubmit: vi.fn(),
      updateLifecycleStatus: vi.fn(),
    });
    const { result } = renderHook(() => useGetCheckoutStatus());
    expect(result.current).toEqual({
      label: 'Payment in progress...',
      labelClassName: 'text-ock-text-foreground-muted',
    });
  });

  it('should return success status', () => {
    vi.mocked(useCheckoutContext).mockReturnValue({
      errorMessage: '',
      lifecycleStatus: {
        statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS,
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
      labelClassName: 'text-ock-text-success',
    });
  });

  it('should return error status', () => {
    vi.mocked(useCheckoutContext).mockReturnValue({
      errorMessage: 'Payment failed',
      lifecycleStatus: {
        statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
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
      labelClassName: 'text-ock-text-error',
    });
  });
});
