import sdk from "@farcaster/frame-sdk";
import { useCallback } from "react";
import { useMiniKit } from "./useMiniKit";

export function useOpenUrl() {
  const { context } = useMiniKit();

  return useCallback((url: string) => {
    if (context) {
      sdk.actions.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  }, [context])
}