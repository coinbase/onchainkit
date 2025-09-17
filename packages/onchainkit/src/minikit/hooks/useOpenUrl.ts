import sdk from '@farcaster/miniapp-sdk';
import { useCallback } from 'react';
import { useMiniKit } from './useMiniKit';

export type UseOpenUrlParams = {
  fallback?: (url: string) => void;
};

/**
 * Opens a new url, if in a frame context, using the openUrl sdk action, otherwise opens via the fallback function.
 *
 * @param options - The options for the useOpenUrl hook.
 * @param options.fallback - The fallback function to use if the context is not available. Defaults to opening in a new tab.
 */
export function useOpenUrl(
  { fallback }: UseOpenUrlParams = {
    fallback: (url) => {
      window.open(url, '_blank');
    },
  },
) {
  const { context } = useMiniKit();

  return useCallback(
    (url: string) => {
      if (context) {
        sdk.actions.openUrl(url);
      } else {
        fallback?.(url);
      }
    },
    [context, fallback],
  );
}
