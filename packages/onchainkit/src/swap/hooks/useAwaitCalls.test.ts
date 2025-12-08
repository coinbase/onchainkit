import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useCallsStatus } from 'wagmi/experimental';
import type { LifecycleStatus } from '../types';
import { useAwaitCalls } from './useAwaitCalls';
import { base } from 'viem/chains';
import type { Mock } from 'vitest';
import type { Config } from 'wagmi';

vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useCallsStatus: vi.fn(),
}));

describe('useAwaitCalls', () => {
  const mockAccountConfig = {
    address: '0x123',
    chains: [base] as const,
  } as unknown as Config;

  const mockUpdateLifecycleStatus = vi.fn();
  const mockLifecycleStatus = {
    statusName: 'transactionApproved',
    statusData: {
      callsId: '0x456',
      transactionType: 'Batched',
      isMissingRequiredField: false,
      maxSlippage: 0.5,
    },
  } as LifecycleStatus;

  beforeEach(() => {
    vi.clearAllMocks();
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {},
    });
  });

  it('should not call waitForTransactionReceipt when data status is not success', async () => {
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { status: 'pending' },
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

  it('should call waitForTransactionReceipt and update lifecycle status when data status is success', async () => {
    const mockTransactionReceipt = { blockNumber: 123 };
    (waitForTransactionReceipt as Mock).mockResolvedValue(
      mockTransactionReceipt,
    );
    const mockData = {
      status: 'success',
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

  it('should use the appropriate refetch interval for success status', () => {
    const mockData = {
      status: 'success',
      receipts: [{}],
    };
    let refetchIntervalFn = vi.fn();
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

  it('should use the appropriate refetch interval for non-success status', () => {
    const mockData = {
      status: 'pending',
    };
    let refetchIntervalFn = vi.fn();
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
        lifecycleStatus: {
          statusName: 'init',
          statusData: {
            isMissingRequiredField: false,
            maxSlippage: 0.5,
          },
        } as LifecycleStatus,
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
