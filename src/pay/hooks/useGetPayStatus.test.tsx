import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { color } from '../../styles/theme';
import { usePayContext } from '../components/CheckoutProvider';
import { PAY_LIFECYCLESTATUS } from '../constants';
import { useGetPayStatus } from './useGetPayStatus';

vi.mock('../components/CheckoutProvider', () => ({
  usePayContext: vi.fn(),
}));

describe('useGetPayStatus', () => {
  it('should return pending status', () => {
    vi.mocked(usePayContext).mockReturnValue({
      errorMessage: '',
      lifecycleStatus: {
        statusName: PAY_LIFECYCLESTATUS.PENDING,
        statusData: {},
      },
      onSubmit: vi.fn(),
      updateLifecycleStatus: vi.fn(),
    });
    const { result } = renderHook(() => useGetPayStatus());
    expect(result.current).toEqual({
      label: 'Payment in progress...',
      labelClassName: color.foregroundMuted,
    });
  });

  it('should return success status', () => {
    vi.mocked(usePayContext).mockReturnValue({
      errorMessage: '',
      lifecycleStatus: {
        statusName: PAY_LIFECYCLESTATUS.SUCCESS,
        statusData: {
          transactionReceipts: [],
          chargeId: '',
          receiptUrl: '',
        },
      },
      onSubmit: vi.fn(),
      updateLifecycleStatus: vi.fn(),
    });
    const { result } = renderHook(() => useGetPayStatus());
    expect(result.current).toEqual({
      label: 'Payment successful!',
      labelClassName: color.success,
    });
  });

  it('should return error status', () => {
    vi.mocked(usePayContext).mockReturnValue({
      errorMessage: 'Payment failed',
      lifecycleStatus: {
        statusName: PAY_LIFECYCLESTATUS.ERROR,
        statusData: {
          code: 'PmUWCSh01',
          error: 'Payment failed',
          message: 'Payment failed',
        },
      },
      onSubmit: vi.fn(),
      updateLifecycleStatus: vi.fn(),
    });
    const { result } = renderHook(() => useGetPayStatus());
    expect(result.current).toEqual({
      label: 'Payment failed',
      labelClassName: color.error,
    });
  });
});
