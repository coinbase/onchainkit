import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MessageCodes,
  subscribeToWindowMessage,
} from './subscribeToWindowMessage';

describe('subscribeToWindowMessage', () => {
  let unsubscribe: () => void;
  const DEFAULT_ORIGIN = 'https://default.origin';
  const mockMessageEvent = (data: unknown, origin = DEFAULT_ORIGIN) =>
    new MessageEvent('message', { data, origin });

  beforeEach(() => {
    unsubscribe = () => {};
  });

  afterEach(() => {
    unsubscribe();
  });

  it('should subscribe to window message and call onMessage when message is received', async () => {
    const onMessage = vi.fn();
    unsubscribe = subscribeToWindowMessage({
      onMessage,
      allowedOrigin: DEFAULT_ORIGIN,
    });

    const event = mockMessageEvent(
      JSON.stringify({
        eventName: MessageCodes.Event,
        data: { key: 'value' },
      }),
    );
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onMessage).toHaveBeenCalledWith({ key: 'value' });
  });

  it('should not call onMessage if the origin is not allowed', async () => {
    const onMessage = vi.fn();
    subscribeToWindowMessage({
      onMessage,
      allowedOrigin: 'https://not.allowed.origin',
    });

    const event = mockMessageEvent(
      JSON.stringify({
        eventName: MessageCodes.Event,
        data: { key: 'value' },
      }),
    );
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onMessage).not.toHaveBeenCalled();
  });

  it('should validate the origin using onValidateOrigin callback', async () => {
    const onMessage = vi.fn();
    const onValidateOrigin = vi.fn().mockResolvedValue(true);
    subscribeToWindowMessage({
      onMessage,
      allowedOrigin: DEFAULT_ORIGIN,
      onValidateOrigin,
    });

    const event = mockMessageEvent(
      JSON.stringify({
        eventName: MessageCodes.Event,
        data: { key: 'value' },
      }),
    );
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onValidateOrigin).toHaveBeenCalledWith(DEFAULT_ORIGIN);
    expect(onMessage).toHaveBeenCalledWith({ key: 'value' });
  });

  it('should not call onMessage if onValidateOrigin returns false', async () => {
    const onMessage = vi.fn();
    const onValidateOrigin = vi.fn().mockResolvedValue(false);
    subscribeToWindowMessage({
      onMessage,
      allowedOrigin: DEFAULT_ORIGIN,
      onValidateOrigin,
    });

    const event = mockMessageEvent(
      JSON.stringify({
        eventName: MessageCodes.Event,
        data: { key: 'value' },
      }),
    );
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onValidateOrigin).toHaveBeenCalledWith(DEFAULT_ORIGIN);
    expect(onMessage).not.toHaveBeenCalled();
  });

  it('should not call onMessage if the message code is not "event"', async () => {
    const onMessage = vi.fn();
    subscribeToWindowMessage({
      onMessage,
      allowedOrigin: DEFAULT_ORIGIN,
    });

    const event = mockMessageEvent(
      JSON.stringify({
        eventName: 'not-event',
        data: { key: 'value' },
      }),
    );
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onMessage).not.toHaveBeenCalled();
  });
});
