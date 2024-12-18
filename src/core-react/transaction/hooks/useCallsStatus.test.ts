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
    const { result } = renderHook(() =>
      useCallsStatus({
        setLifecycleStatus: vi.fn(),
        transactionId,
      }),
    );
    expect(result.current.status).toBe('CONFIRMED');
    expect(result.current.transactionHash).toBe('0x123');
  });

  it('should handle errors and call onError callback', () => {
    const mockSetLifecycleStatus = vi.fn();
    const mockError = new Error('Test error');
    (useCallsStatusWagmi as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw mockError;
    });
    const { result } = renderHook(() =>
      useCallsStatus({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionId,
      }),
    );
    expect(result.current.status).toBe('error');
    expect(result.current.transactionHash).toBeUndefined();
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmUCSh01',
        error: JSON.stringify(mockError),
        message: '',
      },
    });
  });

  it('should set refetchInterval to 1000 ms when status is not CONFIRMED', () => {
    const mockData = {
      status: 'PENDING',
    };

    // Mocking useCallsStatusWagmi to return the specific data and simulate refetchInterval logic
    (useCallsStatusWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ query }) => {
        const refetchInterval = query.refetchInterval({
          state: { data: mockData },
        });
        expect(refetchInterval).toBe(1000);
        return { data: mockData };
      },
    );

    renderHook(() =>
      useCallsStatus({
        setLifecycleStatus: vi.fn(),
        transactionId,
      }),
    );
  });

  it('should set refetchInterval to false when status is CONFIRMED', () => {
    const mockData = {
      status: 'CONFIRMED',
    };

    // Mocking useCallsStatusWagmi to return the specific data and simulate refetchInterval logic
    (useCallsStatusWagmi as ReturnType<typeof vi.fn>).mockImplementation(
      ({ query }) => {
        const refetchInterval = query.refetchInterval({
          state: { data: mockData },
        });
        expect(refetchInterval).toBe(false);
        return { data: mockData };
      },
    );

    renderHook(() =>
      useCallsStatus({
        setLifecycleStatus: vi.fn(),
        transactionId,
      }),
    );
  });

  it('should not fetch data when transactionId is not provided', () => {
    const mockSetLifecycleStatus = vi.fn();
    const mockData = undefined;

    (useCallsStatusWagmi as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockData,
    });

    const { result } = renderHook(() =>
      useCallsStatus({
        setLifecycleStatus: mockSetLifecycleStatus,
        transactionId: '',
      }),
    );

    expect(result.current.status).toBeUndefined();
    expect(result.current.transactionHash).toBeUndefined();
  });
});
