import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  subscribeToWindowMessage,
  MessageCodes,
} from './subscribeToWindowMessage';

describe('subscribeToWindowMessage', () => {
  let unsubscribe: () => void;
  const DEFAULT_ORIGIN = 'https://default.origin';
  const mockMessageEvent = (data: any, origin = DEFAULT_ORIGIN) =>
    new MessageEvent('message', { data, origin });

  let addEventListenerSpy;
  let removeEventListenerSpy;
  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    unsubscribe = () => {};
  });

  afterEach(() => {
    unsubscribe();
  });

  it('should subscribe to window message and call onMessage when message is received', async () => {
    const onMessage = vi.fn();
    unsubscribe = subscribeToWindowMessage(MessageCodes.AppReady, {
      onMessage,
      allowedOrigin: DEFAULT_ORIGIN,
    });

    const event = mockMessageEvent({
      eventName: MessageCodes.AppReady,
      data: { key: 'value' },
    });
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onMessage).toHaveBeenCalledWith({ key: 'value' });
  });

  it('should unsubscribe after the first message if shouldUnsubscribe is true', async () => {
    const onMessage = vi.fn();
    unsubscribe = subscribeToWindowMessage(MessageCodes.AppReady, {
      onMessage,
      shouldUnsubscribe: true,
      allowedOrigin: DEFAULT_ORIGIN,
    });

    const event = mockMessageEvent({
      eventName: MessageCodes.AppReady,
      data: { key: 'value' },
    });
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    window.dispatchEvent(event);

    // check that removeEventListenerSpy was called
    expect(removeEventListenerSpy).toHaveBeenCalled();

    //wait for the async code to run
    await Promise.resolve();

    expect(onMessage).toHaveBeenCalledTimes(1);
  });

  it('should not unsubscribe after the first message if shouldUnsubscribe is false', async () => {
    const onMessage = vi.fn();
    const unsubscribe = subscribeToWindowMessage(MessageCodes.AppReady, {
      onMessage,
      shouldUnsubscribe: false,
      allowedOrigin: DEFAULT_ORIGIN,
    });

    const event = mockMessageEvent({
      eventName: MessageCodes.AppReady,
      data: { key: 'value' },
    });
    window.dispatchEvent(event);
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onMessage).toHaveBeenCalledTimes(2);
  });

  it('should not call onMessage if the origin is not allowed', async () => {
    const onMessage = vi.fn();
    const unsubscribe = subscribeToWindowMessage(MessageCodes.AppReady, {
      onMessage,
      allowedOrigin: 'https://not.allowed.origin',
    });

    const event = mockMessageEvent({
      eventName: MessageCodes.AppReady,
      data: { key: 'value' },
    });
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onMessage).not.toHaveBeenCalled();
  });

  it('should validate the origin using onValidateOrigin callback', async () => {
    const onMessage = vi.fn();
    const onValidateOrigin = vi.fn().mockResolvedValue(true);
    const unsubscribe = subscribeToWindowMessage(MessageCodes.AppReady, {
      onMessage,
      allowedOrigin: DEFAULT_ORIGIN,
      onValidateOrigin,
    });

    const event = mockMessageEvent({
      eventName: MessageCodes.AppReady,
      data: { key: 'value' },
    });
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onValidateOrigin).toHaveBeenCalledWith(DEFAULT_ORIGIN);
    expect(onMessage).toHaveBeenCalledWith({ key: 'value' });
  });

  it('should not call onMessage if onValidateOrigin returns false', async () => {
    const onMessage = vi.fn();
    const onValidateOrigin = vi.fn().mockResolvedValue(false);
    const unsubscribe = subscribeToWindowMessage(MessageCodes.AppReady, {
      onMessage,
      allowedOrigin: DEFAULT_ORIGIN,
      onValidateOrigin,
    });

    const event = mockMessageEvent({
      eventName: MessageCodes.AppReady,
      data: { key: 'value' },
    });
    window.dispatchEvent(event);

    //wait for the async code to run
    await Promise.resolve();

    expect(onValidateOrigin).toHaveBeenCalledWith(DEFAULT_ORIGIN);
    expect(onMessage).not.toHaveBeenCalled();
  });
});
