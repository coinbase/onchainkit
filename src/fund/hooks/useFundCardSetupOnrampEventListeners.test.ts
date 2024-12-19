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
import { useFundContext } from '../components/FundCardProvider';
import { FUND_BUTTON_RESET_TIMEOUT } from '../constants';
import { setupOnrampEventListeners } from '../utils/setupOnrampEventListeners';
import { useFundCardSetupOnrampEventListeners } from './useFundCardSetupOnrampEventListeners';

vi.mock('../components/FundCardProvider', () => ({
  useFundContext: vi.fn(),
}));

vi.mock('../utils/setupOnrampEventListeners', () => ({
  setupOnrampEventListeners: vi.fn(),
}));

describe('useFundCardSetupOnrampEventListeners', () => {
  const mockSetSubmitButtonState = vi.fn();
  let unsubscribeMock = vi.fn();

  beforeEach(() => {
    unsubscribeMock = vi.fn();

    (useFundContext as Mock).mockReturnValue({
      setSubmitButtonState: mockSetSubmitButtonState,
    });

    // Mock setupOnrampEventListeners to return unsubscribe
    (setupOnrampEventListeners as Mock).mockReturnValue(unsubscribeMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe to events on mount and unsubscribe on unmount', () => {
    const { unmount } = renderHook(() =>
      useFundCardSetupOnrampEventListeners(),
    );

    // Verify setupOnrampEventListeners is called
    expect(setupOnrampEventListeners).toHaveBeenCalledWith(
      expect.objectContaining({
        onEvent: expect.any(Function),
        onExit: expect.any(Function),
        onSuccess: expect.any(Function),
      }),
    );

    // Verify unsubscribe is called on unmount
    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('should set button state to "error" and reset after timeout on error event', () => {
    vi.useFakeTimers(); // Use fake timers to test timeout behavior

    let onEventCallback = vi.fn();
    (setupOnrampEventListeners as Mock).mockImplementation(({ onEvent }) => {
      onEventCallback = onEvent;
      return unsubscribeMock;
    });

    renderHook(() => useFundCardSetupOnrampEventListeners());

    // Simulate error event
    onEventCallback({ eventName: 'error' });

    expect(mockSetSubmitButtonState).toHaveBeenCalledWith('error');

    // Simulate timeout
    vi.advanceTimersByTime(FUND_BUTTON_RESET_TIMEOUT);

    expect(mockSetSubmitButtonState).toHaveBeenCalledWith('default');

    vi.useRealTimers();
  });

  it('should set button state to "success" and reset after timeout on success event', () => {
    vi.useFakeTimers();

    let onSuccessCallback = vi.fn();
    (setupOnrampEventListeners as Mock).mockImplementation(({ onSuccess }) => {
      onSuccessCallback = onSuccess;
      return unsubscribeMock;
    });

    renderHook(() => useFundCardSetupOnrampEventListeners());

    // Simulate success event
    onSuccessCallback();

    expect(mockSetSubmitButtonState).toHaveBeenCalledWith('success');

    // Simulate timeout
    vi.advanceTimersByTime(FUND_BUTTON_RESET_TIMEOUT);

    expect(mockSetSubmitButtonState).toHaveBeenCalledWith('default');

    vi.useRealTimers();
  });

  it('should set button state to "default" and log on exit event', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    let onExitCallback = vi.fn();

    (setupOnrampEventListeners as Mock).mockImplementation(({ onExit }) => {
      onExitCallback = onExit;
      return unsubscribeMock;
    });

    renderHook(() => useFundCardSetupOnrampEventListeners());

    // Simulate exit event
    const mockEvent = { reason: 'user_cancelled' };
    onExitCallback(mockEvent);

    expect(mockSetSubmitButtonState).toHaveBeenCalledWith('default');
    expect(consoleSpy).toHaveBeenCalledWith('onExit', mockEvent);

    consoleSpy.mockRestore();
  });
});
