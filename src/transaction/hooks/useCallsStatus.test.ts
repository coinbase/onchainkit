import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useCallsStatus as useCallsStatusWagmi } from 'wagmi/experimental';
import { useCallsStatus } from './useCallsStatus';

vi.mock('wagmi/experimental', () => ({
  useCallsStatus: vi.fn(),
}));

describe('useCallsStatus', () => {
  const transactionId = 'test-id';

  it('should return status and transactionHash when data is successfully fetched', () => {
    const mockData = {
      status: 'CONFIRMED',
      receipts: [{ transactionHash: '0x123' }],
    };
    (useCallsStatusWagmi as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockData,
    });
    const { result } = renderHook(() => useCallsStatus({ transactionId }));
    expect(result.current.status).toBe('CONFIRMED');
    expect(result.current.transactionHash).toBe('0x123');
  });

  it('should handle errors and call onError callback', () => {
    const mockSetLifeCycleStatus = vi.fn();
    const mockError = new Error('Test error');
    (useCallsStatusWagmi as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw mockError;
    });
    const { result } = renderHook(() =>
      useCallsStatus({
        setLifeCycleStatus: mockSetLifeCycleStatus,
        transactionId,
      }),
    );
    expect(result.current.status).toBe('error');
    expect(result.current.transactionHash).toBeUndefined();
    expect(mockSetLifeCycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'UNCAUGHT_CALL_STATUS_ERROR',
        error: JSON.stringify(mockError),
      },
    });
  });
});
