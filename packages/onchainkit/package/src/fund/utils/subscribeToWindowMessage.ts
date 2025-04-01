import { DEFAULT_ONRAMP_URL } from '../constants';
import type { JsonObject } from '../types';

export enum MessageCodes {
  AppParams = 'app_params',
  PaymentLinkSuccess = 'payment_link_success',
  PaymentLinkClosed = 'payment_link_closed',
  GuestCheckoutRedirectSuccess = 'guest_checkout_redirect_success',
  Success = 'success',
  Event = 'event',
}

type MessageData = JsonObject;

/**
 * Subscribes to a message from the parent window.
 * @param messageCode A message code to subscribe to.
 * @param onMessage Callback for when the message is received.
 * @param allowedOrigin The origin to allow messages from.
 * @param onValidateOrigin Callback to validate the origin of the message.
 * @returns
 */
export function subscribeToWindowMessage({
  onMessage,
  allowedOrigin = DEFAULT_ONRAMP_URL,
  onValidateOrigin = () => Promise.resolve(true),
}: {
  onMessage: (data?: MessageData) => void;
  allowedOrigin: string;
  onValidateOrigin?: (origin: string) => Promise<boolean>;
}) {
  const handleMessage = (event: MessageEvent<string>) => {
    if (!isAllowedOrigin({ event, allowedOrigin })) {
      return;
    }

    const { eventName, data } = JSON.parse(event.data);

    if (eventName === 'event') {
      (async () => {
        if (await onValidateOrigin(event.origin)) {
          onMessage(data);
        }
      })();
    }
  };

  window.addEventListener('message', handleMessage);

  // Unsubscribe
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}

function isAllowedOrigin({
  event,
  allowedOrigin,
}: {
  event: MessageEvent;
  allowedOrigin: string;
}) {
  const isOriginAllowed = !allowedOrigin || event.origin === allowedOrigin;
  return isOriginAllowed;
}
