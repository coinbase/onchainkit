import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { EventMetadata } from '../types';
import { setupOnrampEventListeners } from './setupOnrampEventListeners';
import { subscribeToWindowMessage } from './subscribeToWindowMessage';

vi.mock('./subscribeToWindowMessage', () => ({
  subscribeToWindowMessage: vi.fn(),
}));

describe('setupOnrampEventListeners', () => {
  let unsubscribe: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    unsubscribe = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call subscribeToWindowMessage with correct parameters', () => {
    const onEvent = vi.fn();
    const onExit = vi.fn();
    const onSuccess = vi.fn();
    const host = 'https://example.com';

    setupOnrampEventListeners({ onEvent, onExit, onSuccess, host });

    expect(subscribeToWindowMessage).toHaveBeenCalledWith({
      allowedOrigin: host,
      onMessage: expect.any(Function),
    });
  });

  it('should call onSuccess callback when success event is received', () => {
    const onEvent = vi.fn();
    const onExit = vi.fn();
    const onSuccess = vi.fn();
    const host = 'https://example.com';

    setupOnrampEventListeners({ onEvent, onExit, onSuccess, host });

    const eventMetadata: EventMetadata = { eventName: 'success' };

    vi.mocked(subscribeToWindowMessage).mock.calls[0][0].onMessage(
      eventMetadata,
    );

    expect(onSuccess).toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    expect(onEvent).toHaveBeenCalledWith(eventMetadata);
  });

  it('should call onExit callback when exit event is received', () => {
    const onEvent = vi.fn();
    const onExit = vi.fn();
    const onSuccess = vi.fn();
    const host = 'https://example.com';

    setupOnrampEventListeners({ onEvent, onExit, onSuccess, host });

    const eventMetadata: EventMetadata = {
      eventName: 'exit',
      error: {
        errorType: 'internal_error',
      },
    };
    vi.mocked(subscribeToWindowMessage).mock.calls[0][0].onMessage(
      eventMetadata,
    );

    expect(onExit).toHaveBeenCalledWith(eventMetadata.error);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onEvent).toHaveBeenCalledWith(eventMetadata);
  });

  it('should call onEvent callback for any event received', () => {
    const onEvent = vi.fn();
    const onExit = vi.fn();
    const onSuccess = vi.fn();
    const host = 'https://example.com';

    setupOnrampEventListeners({ onEvent, onExit, onSuccess, host });

    const eventMetadata: EventMetadata = { eventName: 'success' };
    vi.mocked(subscribeToWindowMessage).mock.calls[0][0].onMessage(
      eventMetadata,
    );

    expect(onEvent).toHaveBeenCalledWith(eventMetadata);
  });

  it('should return the unsubscribe function', () => {
    const onEvent = vi.fn();
    const onExit = vi.fn();
    const onSuccess = vi.fn();
    const host = 'https://example.com';

    vi.mocked(subscribeToWindowMessage).mockReturnValue(unsubscribe);

    const result = setupOnrampEventListeners({
      onEvent,
      onExit,
      onSuccess,
      host,
    });

    expect(result).toBe(unsubscribe);
  });
});
