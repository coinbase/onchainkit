import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLifecycleStatus } from './useLifecycleStatus';

describe('useLifecycleStatus', () => {
  it('initializes with provided status', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus({
        statusName: 'init',
        statusData: null,
      }),
    );

    expect(result.current[0]).toEqual({
      statusName: 'init',
      statusData: null,
    });
  });

  it('updates status and preserves data', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus({
        statusName: 'init',
        statusData: null,
      }),
    );

    const [, updateStatus] = result.current;
    // Update to pending
    act(() => {
      updateStatus({
        statusName: 'transactionPending',
        statusData: {
          abc: 'def',
        },
      });
    });

    expect(result.current[0]).toEqual({
      statusName: 'transactionPending',
      statusData: {
        abc: 'def',
      },
    });

    // Update to success

    act(() => {
      updateStatus({
        statusName: 'transactionSuccess',
        statusData: {
          assetImageUrl: 'a',
          assetName: 'b',
          assetSymbol: 'c',
          chainId: 'd',
        },
      });
    });

    expect(result.current[0]).toEqual({
      statusName: 'transactionSuccess',
      statusData: {
        abc: 'def',
        assetImageUrl: 'a',
        assetName: 'b',
        assetSymbol: 'c',
        chainId: 'd',
      },
    });
  });

  it('handles error states correctly', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus({
        statusName: 'init',
        statusData: null,
      }),
    );

    const error = {
      errorType: 'network_error' as const,
      code: 'ERROR_CODE',
      debugMessage: 'Something went wrong',
    };

    // Set error state
    act(() => {
      result.current[1]({
        statusName: 'error',
        statusData: error,
      });
    });

    expect(result.current[0]).toEqual({
      statusName: 'error',
      statusData: error,
    });

    // Moving from error to another state should clear error data
    act(() => {
      result.current[1]({
        statusName: 'transactionPending',
        statusData: {},
      });
    });

    expect(result.current[0]).toEqual({
      statusName: 'transactionPending',
      statusData: {},
    });
  });

  it('transitions through a complete lifecycle', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus({
        statusName: 'init',
        statusData: null,
      }),
    );

    // Init -> Pending
    act(() => {
      result.current[1]({
        statusName: 'transactionPending',
        statusData: {},
      });
    });

    expect(result.current[0].statusName).toBe('transactionPending');

    // Pending -> Success
    act(() => {
      result.current[1]({
        statusName: 'transactionSuccess',
        statusData: {},
      });
    });

    expect(result.current[0].statusName).toBe('transactionSuccess');
  });
});
