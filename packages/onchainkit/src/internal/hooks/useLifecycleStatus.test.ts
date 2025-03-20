import type { LifecycleStatus } from '@/swap/types';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { useLifecycleStatus } from './useLifecycleStatus';

const initialLifecycleStatus = {
  statusName: 'init',
  statusData: {
    isMissingRequiredField: true,
    maxSlippage: 0.5,
  },
} as LifecycleStatus;

describe('useLifecycleStatus', () => {
  it('should initialize correctly', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus<LifecycleStatus>(initialLifecycleStatus),
    );

    const [lifecycleStatus] = result.current;
    expect(lifecycleStatus).toEqual(initialLifecycleStatus);
  });

  it('should persist statusData for the full lifecycle', async () => {
    const { result } = renderHook(() =>
      useLifecycleStatus<LifecycleStatus>(initialLifecycleStatus),
    );

    const [initialStatus, updateLifecycleStatus] = result.current;

    expect(initialStatus).toEqual(initialLifecycleStatus);

    await act(async () => {
      updateLifecycleStatus({
        statusName: 'transactionPending',
      });
    });

    const [updatedStatus] = result.current;

    expect(updatedStatus).toEqual({
      statusName: 'transactionPending',
      statusData: {
        isMissingRequiredField: true,
        maxSlippage: 0.5,
      },
    });
  });

  it('should not persist errors', async () => {
    const { result } = renderHook(() =>
      useLifecycleStatus<LifecycleStatus>(initialLifecycleStatus),
    );

    const [initialStatus, updateLifecycleStatus] = result.current;

    expect(initialStatus).toEqual(initialLifecycleStatus);

    await act(async () => {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          error: 'error',
          code: 'error code',
          message: 'error message',
        },
      });
    });

    let [updatedStatus] = result.current;

    expect(updatedStatus).toEqual({
      statusName: 'error',
      statusData: {
        error: 'error',
        code: 'error code',
        message: 'error message',
        isMissingRequiredField: true,
        maxSlippage: 0.5,
      },
    });

    await act(async () => {
      updateLifecycleStatus({
        statusName: 'transactionPending',
      });
    });

    [updatedStatus] = result.current;

    expect(updatedStatus).toEqual({
      statusName: 'transactionPending',
      statusData: {
        isMissingRequiredField: true,
        maxSlippage: 0.5,
      },
    });
  });

  it('should overwrite passed in statusData', async () => {
    const { result } = renderHook(() =>
      useLifecycleStatus<LifecycleStatus>(initialLifecycleStatus),
    );

    const [, updateLifecycleStatus] = result.current;

    await act(async () => {
      updateLifecycleStatus({
        statusName: 'slippageChange',
        statusData: {
          maxSlippage: 3,
        },
      });
    });

    const [updatedStatus] = result.current;

    expect(updatedStatus).toEqual({
      statusName: 'slippageChange',
      statusData: {
        maxSlippage: 3,
        isMissingRequiredField: true,
      },
    });
  });
});
