import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useAwaitCalls } from './useAwaitCalls';

vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn(),
}));

describe('useAwaitCalls', () => {
  const mockAccountConfig = {
    address: '0x123',
  };
  const mockConfig = { maxSlippage: 0.1 };
  const mockSetLifecycleStatus = vi.fn();

  it('should not call waitForTransactionReceipt when data status is not CONFIRMED', async () => {
    const { result } = renderHook(() =>
      useAwaitCalls({
        accountConfig: mockAccountConfig,
        callsStatus: {
          data: { status: 'PENDING' },
        },
        config: mockConfig,
        setLifecycleStatus: mockSetLifecycleStatus,
      }),
    );
    await act(async () => {
      await result.current();
    });
    expect(waitForTransactionReceipt).not.toHaveBeenCalled();
    expect(mockSetLifecycleStatus).not.toHaveBeenCalled();
  });

  it('should call waitForTransactionReceipt and update lifecycle status when data status is CONFIRMED', async () => {
    const mockTransactionReceipt = { blockNumber: 123 };
    (waitForTransactionReceipt as jest.Mock).mockResolvedValue(
      mockTransactionReceipt,
    );
    const mockData = {
      status: 'CONFIRMED',
      receipts: [{ transactionHash: '0x123' }],
    };
    const { result } = renderHook(() =>
      useAwaitCalls({
        accountConfig: mockAccountConfig,
        callsStatus: {
          data: mockData,
        },
        config: mockConfig,
        setLifecycleStatus: mockSetLifecycleStatus,
      }),
    );
    await act(async () => {
      await result.current();
    });
    expect(waitForTransactionReceipt).toHaveBeenCalledWith(mockAccountConfig, {
      confirmations: 1,
      hash: '0x123',
    });
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage: mockConfig.maxSlippage,
        transactionReceipt: mockTransactionReceipt,
      },
    });
  });
});
