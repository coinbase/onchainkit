import sdk from "@farcaster/frame-sdk";
import { useCallback } from "react";

export function useClose() {
  return useCallback(() => {
    sdk.actions.close();
  }, [])
}