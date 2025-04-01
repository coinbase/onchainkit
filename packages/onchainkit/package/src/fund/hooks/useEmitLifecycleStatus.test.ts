import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useEmitLifecycleStatus } from './useEmitLifecycleStatus';

describe('useEmitLifecycleStatus', () => {
  it('initializes with init status', () => {
    const { result } = renderHook(() =>
      useEmitLifecycleStatus({
        onError: vi.fn(),
        onSuccess: vi.fn(),
        onStatus: vi.fn(),
      }),
    );

    expect(result.current.lifecycleStatus).toEqual({
      statusName: 'init',
      statusData: null,
    });
  });

  it('calls onError when error status is set', () => {
    const onError = vi.fn();
    const onStatus = vi.fn();

    const { result } = renderHook(() =>
      useEmitLifecycleStatus({
        onError,
        onSuccess: vi.fn(),
        onStatus,
      }),
    );

    const error = {
      errorType: 'network_error' as const,
      code: 'ERROR_CODE',
      debugMessage: 'Test error',
    };

    act(() => {
      result.current.updateLifecycleStatus({
        statusName: 'error',
        statusData: error,
      });
    });

    expect(onError).toHaveBeenCalledWith(error);
    expect(onStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: error,
    });
  });

  it('calls onSuccess when transaction succeeds', () => {
    const onSuccess = vi.fn();
    const onStatus = vi.fn();

    const { result } = renderHook(() =>
      useEmitLifecycleStatus({
        onError: vi.fn(),
        onSuccess,
        onStatus,
      }),
    );

    act(() => {
      result.current.updateLifecycleStatus({
        statusName: 'transactionSuccess',
        statusData: undefined,
      });
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(onStatus).toHaveBeenCalledWith({
      statusName: 'init',
      statusData: null,
    });
  });

  it('calls onStatus for all status changes', () => {
    const onStatus = vi.fn();

    const { result } = renderHook(() =>
      useEmitLifecycleStatus({
        onError: vi.fn(),
        onSuccess: vi.fn(),
        onStatus,
      }),
    );

    // Test transition_view status
    act(() => {
      result.current.updateLifecycleStatus({
        statusName: 'transactionPending',
        statusData: undefined,
      });
    });

    expect(onStatus.mock.calls[0][0]).toEqual({
      statusName: 'init',
      statusData: null,
    });
    expect(onStatus.mock.calls[1][0]).toEqual({
      statusName: 'transactionPending',
      statusData: {},
    });
  });

  it('handles undefined callbacks gracefully', () => {
    const { result } = renderHook(() =>
      useEmitLifecycleStatus({
        onError: undefined,
        onSuccess: undefined,
        onStatus: undefined,
      }),
    );

    // Should not throw when callbacks are undefined
    act(() => {
      result.current.updateLifecycleStatus({
        statusName: 'error',
        statusData: { errorType: 'network_error' },
      });
    });

    act(() => {
      result.current.updateLifecycleStatus({
        statusName: 'transactionSuccess',
        statusData: undefined,
      });
    });
  });
});
