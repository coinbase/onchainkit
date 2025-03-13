import sdk from '@farcaster/frame-sdk';
import { useCallback } from 'react';
import { useMiniKit } from './useMiniKit';

/**
 * Opens the profile of the passed in fid, falling back to the user's farcaster account.
 * @param fid [optional] - The FID of the user to view the profile of.
 * @returns void
 */
export function useViewProfile() {
  const { context } = useMiniKit();

  return useCallback(
    (fid?: number) => {
      const profileFid = fid ?? context?.user?.fid;

      if (!profileFid) {
        return;
      }

      sdk.actions.viewProfile({ fid: profileFid });
    },
    [context?.user?.fid],
  );
}
