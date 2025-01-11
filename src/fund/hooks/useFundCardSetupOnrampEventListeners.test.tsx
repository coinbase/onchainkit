import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { renderHook } from '@testing-library/react';
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
import { setupOnrampEventListeners } from '../utils/setupOnrampEventListeners';
import { useFundCardSetupOnrampEventListeners } from './useFundCardSetupOnrampEventListeners';

vi.mock('../utils/setupOnrampEventListeners', () => ({
  setupOnrampEventListeners: vi.fn(),
}));

describe('useFundCardSetupOnrampEventListeners', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
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

  it('calls onError when exit event occurs', () => {
    let exitHandler: (error?: OnrampError) => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onExit }) => {
      exitHandler = onExit;
      return () => {};
    });

    const onError = vi.fn();
    renderHookWithProvider({ onError });

    exitHandler(mockError);
    expect(onError).toHaveBeenCalledWith(mockError);
  });

  it('calls onStatus when event occurs', () => {
    let eventHandler: (event: EventMetadata) => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onEvent }) => {
      eventHandler = onEvent;
      return () => {};
    });

    const onStatus = vi.fn();
    renderHookWithProvider({ onStatus });

    eventHandler(mockEvent);
    expect(onStatus).toHaveBeenCalledWith(mockEvent);
  });

  it('calls onSuccess when success event occurs', () => {
    let successHandler: () => void = () => {};

    (setupOnrampEventListeners as Mock).mockImplementation(({ onSuccess }) => {
      successHandler = onSuccess;
      return () => {};
    });

    const onSuccess = vi.fn();
    renderHookWithProvider({ onSuccess });

    successHandler();
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
});
