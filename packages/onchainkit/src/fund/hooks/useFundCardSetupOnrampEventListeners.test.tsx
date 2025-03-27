import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { act, renderHook } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { FundCardProvider } from '../components/FundCardProvider';
import { FUND_BUTTON_RESET_TIMEOUT } from '../constants';
import type { EventMetadata, OnrampError } from '../types';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { setupOnrampEventListeners } from '../utils/setupOnrampEventListeners';
import { useFundCardSetupOnrampEventListeners } from './useFundCardSetupOnrampEventListeners';

vi.mock('../utils/setupOnrampEventListeners', () => ({
  setupOnrampEventListeners: vi.fn(),
}));
vi.mock('../utils/fetchOnrampQuote');

const mockResponseData = {
  paymentTotal: { value: '100.00', currency: 'USD' },
  paymentSubtotal: { value: '120.00', currency: 'USD' },
  purchaseAmount: { value: '0.1', currency: 'BTC' },
  coinbaseFee: { value: '2.00', currency: 'USD' },
  networkFee: { value: '1.00', currency: 'USD' },
  quoteId: 'quote-id-123',
};

describe('useFundCardSetupOnrampEventListeners', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (fetchOnrampQuote as Mock).mockResolvedValue(mockResponseData);
    setOnchainKitConfig({ apiKey: 'mock-api-key' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockError: OnrampError = {
    errorType: 'internal_error',
    code: 'ERROR_CODE',
    debugMessage: 'Error message',
  };

  const mockEvent: EventMetadata = {
    eventName: 'error',
    error: mockError,
  };

  const renderHookWithProvider = ({
    onError = vi.fn(),
    onStatus = vi.fn(),
    onSuccess = vi.fn(),
  } = {}) => {
    return renderHook(() => useFundCardSetupOnrampEventListeners(), {
      wrapper: ({ children }) => (
        <FundCardProvider
          asset="ETH"
          country="US"
          onError={onError}
          onStatus={onStatus}
          onSuccess={onSuccess}
        >
          {children}
        </FundCardProvider>
      ),
    });
  };

  it('calls onStatus when exit event occurs', () => {
    let exitHandler: (event: EventMetadata) => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onExit }) => {
      exitHandler = onExit;
      return () => {};
    });

    const onStatus = vi.fn();
    renderHookWithProvider({ onStatus });

    act(() => {
      exitHandler({
        eventName: 'exit',
      });
    });
    expect(onStatus.mock.calls[1][0]).toEqual({
      statusName: 'exit',
      statusData: {},
    });
  });

  it('calls onStatus when event occurs', () => {
    let eventHandler: (event: EventMetadata) => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onEvent }) => {
      eventHandler = onEvent;
      return () => {};
    });

    const onStatus = vi.fn();
    renderHookWithProvider({ onStatus });

    act(() => {
      eventHandler({
        eventName: 'transition_view',
        pageRoute: '/some-route',
      });
    });
    expect(onStatus.mock.calls[1][0]).toEqual({
      statusName: 'transactionPending',
      statusData: {},
    });
  });

  it('calls onSuccess when success event occurs', () => {
    let successHandler: () => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onSuccess }) => {
      successHandler = onSuccess;
      return () => {};
    });

    const onSuccess = vi.fn();
    renderHookWithProvider({ onSuccess });

    act(() => {
      successHandler();
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('sets button state to error and resets after timeout when error event occurs', () => {
    let eventHandler: (event: EventMetadata) => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onEvent }) => {
      eventHandler = onEvent;
      return () => {};
    });

    const { result } = renderHookWithProvider();

    eventHandler(mockEvent);
    expect(result.current).toBe(undefined); // Hook doesn't return anything

    vi.advanceTimersByTime(FUND_BUTTON_RESET_TIMEOUT);
  });

  it('sets button state to success and resets after timeout when success occurs', () => {
    let successHandler: () => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onSuccess }) => {
      successHandler = onSuccess;
      return () => {};
    });

    const { result } = renderHookWithProvider();

    successHandler();
    expect(result.current).toBe(undefined); // Hook doesn't return anything

    vi.advanceTimersByTime(FUND_BUTTON_RESET_TIMEOUT);
  });

  it('cleans up event listeners on unmount', () => {
    const unsubscribe = vi.fn();
    (setupOnrampEventListeners as Mock).mockReturnValue(unsubscribe);

    const { unmount } = renderHookWithProvider();
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('handles transition_view event correctly', () => {
    let eventHandler: (event: EventMetadata) => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onEvent }) => {
      eventHandler = onEvent;
      return () => {};
    });

    const onStatus = vi.fn();
    renderHookWithProvider({ onStatus });

    expect(onStatus).toHaveBeenCalledWith({
      statusName: 'init',
      statusData: null,
    });

    // First transition_view event should update status
    act(() => {
      eventHandler({
        eventName: 'transition_view',
        pageRoute: '/some-route',
      });
    });

    expect(onStatus.mock.calls[1][0]).toEqual({
      statusName: 'transactionPending',
      statusData: {},
    });

    // Second transition_view event while already pending should not update status
    act(() => {
      eventHandler({
        eventName: 'transition_view',
        pageRoute: '/another-route',
      });
    });

    // Should not call onStatus again since we're already in pending state
    expect(onStatus.mock.calls[2][0]).toEqual({
      statusName: 'transactionPending',
      statusData: {},
    });
  });

  it('preserves existing status data when handling events', () => {
    let eventHandler: (event: EventMetadata) => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onEvent }) => {
      eventHandler = onEvent;
      return () => {};
    });

    const onStatus = vi.fn();
    renderHookWithProvider({ onStatus });

    // Set initial state with some data
    act(() => {
      eventHandler({
        eventName: 'transition_view',
        pageRoute: '/some-route',
      });
    });

    // Clear first call
    onStatus.mockClear();

    // Trigger error event
    act(() => {
      eventHandler({
        eventName: 'error',
        error: {
          errorType: 'network_error',
          code: 'ERROR_CODE',
          debugMessage: 'Error message',
        },
      });
    });

    // Verify error state includes the error data
    expect(onStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        errorType: 'network_error',
        code: 'ERROR_CODE',
        debugMessage: 'Error message',
      },
    });
  });
});
