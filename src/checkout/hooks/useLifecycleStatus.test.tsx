import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CHECKOUT_LIFECYCLESTATUS } from '../constants';
import type { LifecycleStatus, LifecycleStatusUpdate } from '../types';
import { useLifecycleStatus } from './useLifecycleStatus';

const initialLifecycleStatus: LifecycleStatus = {
  statusName: CHECKOUT_LIFECYCLESTATUS.INIT,
  statusData: {},
};

describe('useLifecycleStatus', () => {
  it('should initialize correctly', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus(initialLifecycleStatus),
    );
    expect(result.current.lifecycleStatus).toEqual(initialLifecycleStatus);
  });

  it('should persist statusData for the full lifecycle', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus(initialLifecycleStatus),
    );
    expect(result.current.lifecycleStatus).toEqual(initialLifecycleStatus);
    act(() => {
      result.current.updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
      });
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
      statusData: {},
    });
  });

  it('should not persist errors', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus(initialLifecycleStatus),
    );
    expect(result.current.lifecycleStatus).toEqual(initialLifecycleStatus);
    act(() => {
      result.current.updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
        statusData: {
          error: 'error',
          code: 'error code',
          message: 'error message',
        },
      } as LifecycleStatusUpdate);
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: CHECKOUT_LIFECYCLESTATUS.ERROR,
      statusData: {
        error: 'error',
        code: 'error code',
        message: 'error message',
      },
    });
    act(() => {
      result.current.updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
      });
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
      statusData: {},
    });
  });

  it('should overwrite passed in statusData', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus(initialLifecycleStatus),
    );
    act(() => {
      result.current.updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
        statusData: {},
      });
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: CHECKOUT_LIFECYCLESTATUS.PENDING,
      statusData: {},
    });
  });

  it('should handle success status with transaction receipts', () => {
    const { result } = renderHook(() =>
      useLifecycleStatus(initialLifecycleStatus),
    );
    act(() => {
      result.current.updateLifecycleStatus({
        statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS,
        statusData: {
          transactionReceipts: [],
          chargeId: 'charge123',
          receiptUrl: 'https://example.com/receipt',
        },
      } as LifecycleStatusUpdate);
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: CHECKOUT_LIFECYCLESTATUS.SUCCESS,
      statusData: {
        transactionReceipts: [],
        chargeId: 'charge123',
        receiptUrl: 'https://example.com/receipt',
      },
    });
  });
});
