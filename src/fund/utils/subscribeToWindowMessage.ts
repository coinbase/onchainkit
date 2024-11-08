import { DEFAULT_ONRAMP_URL } from '../constants';
import type { JsonObject } from '../types';

export enum MessageCodes {
  LaunchEmbedded = 'launch_embedded',
  AppReady = 'app_ready',
  AppParams = 'app_params', 
  PaymentLinkSuccess = 'payment_link_success', 
  PaymentLinkClosed = 'payment_link_closed', 
  GuestCheckoutRedirectSuccess = 'guest_checkout_redirect_success',
  SigninSuccess = 'signin_success',
  Success = 'success', 
  Exit = 'exit', 
  Event = 'event',
}

export type MessageCode = `${MessageCodes}`;

export type MessageData = JsonObject;

export type PostMessageData = {
  eventName: MessageCode;
  data?: MessageData;
};

/**
 * Subscribes to a message from the parent window.
 * @param messageCode A message code to subscribe to.
 * @param onMessage Callback for when the message is received.
 * @param shouldUnsubscribe Whether to unsubscribe after the first message is received.
 * @param allowedOrigin The origin to allow messages from.
 * @param onValidateOrigin Callback to validate the origin of the message.
 * @returns
 */
export function subscribeToWindowMessage(
  messageCode: MessageCode,
  {
    onMessage,
    shouldUnsubscribe = true,
    allowedOrigin = DEFAULT_ONRAMP_URL,
    onValidateOrigin = () => Promise.resolve(true),
  }: {
    onMessage: (data?: MessageData) => void;
    shouldUnsubscribe?: boolean;
    allowedOrigin: string;
    onValidateOrigin?: (origin: string) => Promise<boolean>;
  },
) {
  const handleMessage = (event: MessageEvent<PostMessageData>) => {
    if (!isAllowedOrigin({ event, allowedOrigin })) {
      return;
    }

    const { eventName, data } = event.data;

    if (eventName === messageCode) {
      (async () => {
        if (await onValidateOrigin(event.origin)) {
          onMessage(data);
          if (shouldUnsubscribe) {
            window.removeEventListener('message', handleMessage);
          }
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
