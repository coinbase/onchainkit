import sdk from '@farcaster/frame-sdk';
import { useCallback } from 'react';
import { useMiniKit } from './useMiniKit';

/**
 * Adds a frame to the user's farcaster account, enabling notifications.
 * @returns The notification details of the frame added or null if the frame was not added successfully.
 */
export function useAddFrame() {
  const { updateClientContext } = useMiniKit();

  return useCallback(async () => {
    const result = await sdk.actions.addFrame();

    if (result.notificationDetails) {
      updateClientContext({
        details: result.notificationDetails,
        frameAdded: true,
      });
      return result.notificationDetails;
    }
    return null;
  }, [updateClientContext]);
}
