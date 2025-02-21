import sdk from "@farcaster/frame-sdk";
import { useCallback } from "react";
import { useMiniKit } from "./useMiniKit";

export function useViewProfile() {
  const { context } = useMiniKit();
  
  return useCallback((fid?: number) => {
    const profileFid = fid ?? context?.user?.fid;

    if (!profileFid) {
      return;
    }

    sdk.actions.viewProfile({ fid: profileFid })
  }, [context?.user?.fid])
}
  