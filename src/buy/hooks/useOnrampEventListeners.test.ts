import { act, renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { setupOnrampEventListeners } from '../../fund/utils/setupOnrampEventListeners';
import { useOnrampEventListeners } from './useOnrampEventListeners';

vi.mock('../../fund/utils/setupOnrampEventListeners');

describe('useOnrampEventListeners', () => {
  const mockUpdateLifecycleStatus = vi.fn();
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockedSetupOnrampEventListeners =
      setupOnrampEventListeners as unknown as Mock;
    mockedSetupOnrampEventListeners.mockImplementation(() => mockUnsubscribe);
  });

  it('should call setupOnrampEventListeners and cleanup on unmount', () => {
    const { unmount } = renderHook(() =>
      useOnrampEventListeners({
        updateLifecycleStatus: mockUpdateLifecycleStatus,
        maxSlippage: 0.5,
        lifecycleStatus: {
          statusName: 'init',
          statusData: {
            isMissingRequiredField: false,
            maxSlippage: 0.5,
          },
        },
      }),
    );

    expect(setupOnrampEventListeners).toHaveBeenCalledWith({
      onEvent: expect.any(Function),
      onSuccess: expect.any(Function),
    });

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should handle transition_view event', () => {
    renderHook(() =>
      useOnrampEventListeners({
        updateLifecycleStatus: mockUpdateLifecycleStatus,
        maxSlippage: 0.5,
        lifecycleStatus: {
          statusName: 'init',
          statusData: {
            isMissingRequiredField: false,
            maxSlippage: 0.5,
          },
        },
      }),
    );

    const mockedSetupOnrampEventListeners =
      setupOnrampEventListeners as unknown as Mock;
    const onEventCallback =
      mockedSetupOnrampEventListeners.mock.calls[0][0].onEvent;

    act(() => {
      onEventCallback({
        eventName: 'transition_view',
      });
    });

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'transactionPending',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage: 0.5,
      },
    });
  });

  it('should not handle transition_view event if lifecycleStatus is transactionPending', () => {
    renderHook(() =>
      useOnrampEventListeners({
        updateLifecycleStatus: mockUpdateLifecycleStatus,
        maxSlippage: 0.5,
        lifecycleStatus: {
          statusName: 'transactionPending',
          statusData: {
            isMissingRequiredField: false,
            maxSlippage: 0.5,
          },
        },
      }),
    );

    const mockedSetupOnrampEventListeners =
      setupOnrampEventListeners as unknown as Mock;
    const onEventCallback =
      mockedSetupOnrampEventListeners.mock.calls[0][0].onEvent;

    act(() => {
      onEventCallback({
        eventName: 'transition_view',
      });
    });

    expect(mockUpdateLifecycleStatus).not.toHaveBeenCalledWith({
      statusName: 'transactionPending',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage: 0.5,
      },
    });
  });

  it('should handle onramp success', () => {
    renderHook(() =>
      useOnrampEventListeners({
        updateLifecycleStatus: mockUpdateLifecycleStatus,
        maxSlippage: 0.5,
        lifecycleStatus: {
          statusName: 'init',
          statusData: {
            isMissingRequiredField: false,
            maxSlippage: 0.5,
          },
        },
      }),
    );

    const mockedSetupOnrampEventListeners =
      setupOnrampEventListeners as unknown as Mock;
    const onSuccessCallback =
      mockedSetupOnrampEventListeners.mock.calls[0][0].onSuccess;

    act(() => {
      onSuccessCallback();
    });

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
      statusData: {
        isMissingRequiredField: false,
        transactionReceipt: {},
        maxSlippage: 0.5,
      },
    });
  });

  it('should handle popup close', () => {
    const { result } = renderHook(() =>
      useOnrampEventListeners({
        updateLifecycleStatus: mockUpdateLifecycleStatus,
        maxSlippage: 0.5,
        lifecycleStatus: {
          statusName: 'init',
          statusData: {
            isMissingRequiredField: false,
            maxSlippage: 0.5,
          },
        },
      }),
    );

    act(() => {
      result.current.onPopupClose();
    });

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'init',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage: 0.5,
      },
    });
  });
});
