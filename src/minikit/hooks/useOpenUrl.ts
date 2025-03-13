import sdk from '@farcaster/frame-sdk';
import { useCallback } from 'react';
import { useMiniKit } from './useMiniKit';

/**
 * Opens a new url, if in a frame context, using the openUrl sdk action, otherwise opens in a new tab
 * @param url - The URL to open.
 * @returns void
 */
export function useOpenUrl() {
  const { context } = useMiniKit();

  return useCallback(
    (url: string) => {
      if (context) {
        sdk.actions.openUrl(url);
      } else {
        window.open(url, '_blank');
      }
    },
    [context],
  );
}
