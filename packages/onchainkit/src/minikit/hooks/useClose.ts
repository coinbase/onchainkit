import sdk from '@farcaster/miniapp-sdk';
import { useCallback } from 'react';

/**
 * Closes the frame.
 * @returns void
 */
export function useClose() {
  return useCallback(() => {
    sdk.actions.close();
  }, []);
}
