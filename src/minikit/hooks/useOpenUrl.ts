import sdk from "@farcaster/frame-sdk";
import { useCallback } from "react";

export function useOpenUrl() {
  return useCallback((url: string) => {
    sdk.actions.openUrl(url);
  }, [])
}