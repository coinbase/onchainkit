// @ts-nocheck - more complex changes required
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useCallsStatus } from 'wagmi/experimental';
import type { LifecycleStatus } from '../types';
import { useAwaitCalls } from './useAwaitCalls';

vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useCallsStatus: vi.fn(),
}));

describe('useAwaitCalls', () => {
  const mockAccountConfig = {
    address: '0x123',
  };
  const mockUpdateLifecycleStatus = vi.fn();
  const mockLifecycleStatus: LifecycleStatus = {
    statusName: 'transactionApproved',
    statusData: {
      callsId: '0x456',
      transactionType: 'Batched',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {},
    });
  });

  it('should not call waitForTransactionReceipt when data status is not CONFIRMED', async () => {
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { status: 'PENDING' },
    });
    const { result } = renderHook(() =>
      useAwaitCalls({
        accountConfig: mockAccountConfig,
        lifecycleStatus: mockLifecycleStatus,
        updateLifecycleStatus: mockUpdateLifecycleStatus,
      }),
    );
    await act(async () => {
      await result.current();
    });
    expect(waitForTransactionReceipt).not.toHaveBeenCalled();
    expect(mockUpdateLifecycleStatus).not.toHaveBeenCalled();
  });

  it('should call waitForTransactionReceipt and update lifecycle status when data status is CONFIRMED', async () => {
    const mockTransactionReceipt = { blockNumber: 123 };
    (waitForTransactionReceipt as vi.Mock).mockResolvedValue(
      mockTransactionReceipt,
    );
    const mockData = {
      status: 'CONFIRMED',
      receipts: [{ transactionHash: '0x789' }],
    };
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockData,
    });
    const { result } = renderHook(() =>
      useAwaitCalls({
        accountConfig: mockAccountConfig,
        lifecycleStatus: mockLifecycleStatus,
        updateLifecycleStatus: mockUpdateLifecycleStatus,
      }),
    );
    await act(async () => {
      await result.current();
    });
    expect(waitForTransactionReceipt).toHaveBeenCalledWith(mockAccountConfig, {
      confirmations: 1,
      hash: '0x789',
    });
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
      statusData: {
        transactionReceipt: mockTransactionReceipt,
      },
    });
  });

  it('should use the appropriate refetch interval for CONFIRMED status', () => {
    const mockData = {
      status: 'CONFIRMED',
      receipts: [{}],
    };
    let refetchIntervalFn: typeof vi.fn;
    (useCallsStatus as ReturnType<typeof vi.fn>).mockImplementation(
      ({ query }) => {
        refetchIntervalFn = query.refetchInterval;
        return { data: mockData };
      },
    );
    renderHook(() =>
      useAwaitCalls({
        accountConfig: mockAccountConfig,
        lifecycleStatus: mockLifecycleStatus,
        updateLifecycleStatus: mockUpdateLifecycleStatus,
      }),
    );
    const result = refetchIntervalFn({ state: { data: mockData } });
    expect(result).toBe(false);
  });

  it('should use the appropriate refetch interval for non-CONFIRMED status', () => {
    const mockData = {
      status: 'PENDING',
    };
    let refetchIntervalFn: typeof vi.fn;
    (useCallsStatus as ReturnType<typeof vi.fn>).mockImplementation(
      ({ query }) => {
        refetchIntervalFn = query.refetchInterval;
        return { data: mockData };
      },
    );
    renderHook(() =>
      useAwaitCalls({
        accountConfig: mockAccountConfig,
        lifecycleStatus: mockLifecycleStatus,
        updateLifecycleStatus: mockUpdateLifecycleStatus,
      }),
    );
    const result = refetchIntervalFn({ state: { data: mockData } });
    expect(result).toBe(1000);
  });

  it('should disable the query when lifecycleStatus is not transactionApproved', () => {
    let queryEnabled: boolean | undefined;
    (useCallsStatus as ReturnType<typeof vi.fn>).mockImplementation(
      ({ query }) => {
        queryEnabled = query.enabled;
        return { data: {} };
      },
    );
    renderHook(() =>
      useAwaitCalls({
        accountConfig: mockAccountConfig,
        lifecycleStatus: { statusName: 'init' },
        updateLifecycleStatus: mockUpdateLifecycleStatus,
      }),
    );
    expect(queryEnabled).toBe(false);
  });

  it('should enable the query when lifecycleStatus is transactionApproved', () => {
    let queryEnabled: boolean | undefined;
    (useCallsStatus as ReturnType<typeof vi.fn>).mockImplementation(
      ({ query }) => {
        queryEnabled = query.enabled;
        return { data: {} };
      },
    );
    renderHook(() =>
      useAwaitCalls({
        accountConfig: mockAccountConfig,
        lifecycleStatus: mockLifecycleStatus,
        updateLifecycleStatus: mockUpdateLifecycleStatus,
      }),
    );
    expect(queryEnabled).toBe(true);
  });
});
