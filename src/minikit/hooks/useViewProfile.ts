import sdk from "@farcaster/frame-sdk";
import { useCallback } from "react";
import { useMiniKit } from "./useMiniKit";

export function useViewProfile() {
  const { context } = useMiniKit();
  
  return useCallback(() => {
    if (!context?.user?.fid) {
      return;
    }

    sdk.actions.viewProfile({ fid: context.user.fid })
  }, [context])
}
  