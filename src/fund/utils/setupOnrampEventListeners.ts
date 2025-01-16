import { DEFAULT_ONRAMP_URL } from '../constants';
import type { EventMetadata, OnrampError, SuccessEventData } from '../types';
import { subscribeToWindowMessage } from './subscribeToWindowMessage';

type SetupOnrampEventListenersParams = {
  host?: string;
  onSuccess?: (data?: SuccessEventData) => void;
  onExit?: (error?: OnrampError) => void;
  onEvent?: (event: EventMetadata) => void;
};

/**
 * Subscribes to events from the Coinbase Onramp widget.
 * @param onEvent - Callback for when any event is received.
 * @param onExit - Callback for when an exit event is received.
 * @param onSuccess - Callback for when a success event is received.
 * @returns a function to unsubscribe from the event listener.
 */
export function setupOnrampEventListeners({
  onEvent,
  onExit,
  onSuccess,
  host = DEFAULT_ONRAMP_URL,
}: SetupOnrampEventListenersParams) {
  const unsubscribe = subscribeToWindowMessage({
    allowedOrigin: host,
    onMessage: (data) => {
      const metadata = data as EventMetadata;

      if (metadata.eventName === 'success') {
        onSuccess?.(metadata.data);
      }
      if (metadata.eventName === 'exit') {
        onExit?.(metadata.error);
      }
      onEvent?.(metadata);
    },
  });

  return unsubscribe;
}
