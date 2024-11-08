import { DEFAULT_ONRAMP_URL } from '../constants';
import type { EventMetadata } from '../types/events';
import { subscribeToWindowMessage } from './subscribeToWindowMessage';

type SetupEventSubscriptionsParams = {
  host?: string;
  onSuccess?: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onExit?: (error?: any) => void;
  onEvent?: (event: EventMetadata) => void;
};

/**
 * Subscribes to events from the Coinbase Onramp widget.
 * @param onEvent - Callback for when any event is received.
 * @param onExit - Callback for when an exit event is received.
 * @param onSuccess - Callback for when a success event is received.
 * @returns a function to unsubscribe from the event listener.
 */
export function setupEventSubscriptions({
  onEvent,
  onExit,
  onSuccess,
  host = DEFAULT_ONRAMP_URL,
}: SetupEventSubscriptionsParams) {
  const unsubscribe = subscribeToWindowMessage('event', {
    allowedOrigin: host,
    onMessage: (data) => {
      const metadata = data as EventMetadata;

      if (metadata.eventName === 'success') {
        onSuccess?.();
      }
      if (metadata.eventName === 'exit') {
        onExit?.(metadata.error);
      }
      onEvent?.(metadata);
    },
  });

  return unsubscribe;
}
